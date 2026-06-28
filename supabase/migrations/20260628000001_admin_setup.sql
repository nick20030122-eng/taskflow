-- =============================================================
-- Day 14: 관리자 콘솔 — profiles / security / activity_logs
-- =============================================================

-- ① profiles 테이블
CREATE TABLE profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL DEFAULT 'user'
                         CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 기존 유저 자동 등록
INSERT INTO profiles (id, role)
SELECT id, 'user' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 신규 가입 시 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ② security 스키마 + is_admin 함수
CREATE SCHEMA IF NOT EXISTS security;

CREATE OR REPLACE FUNCTION security.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER
SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ③ profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_self_or_admin"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR security.is_admin());

CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (security.is_admin());

-- ④ teams / tasks 에 admin 전체 조회 정책 추가
CREATE POLICY "teams_admin_select"
  ON teams FOR SELECT
  USING (security.is_admin());

CREATE POLICY "tasks_admin_select"
  ON tasks FOR SELECT
  USING (security.is_admin());

-- ⑤ activity_logs 테이블
CREATE TABLE activity_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT        NOT NULL,
  event_data JSONB       DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs_insert_self"
  ON activity_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "logs_select_self_or_admin"
  ON activity_logs FOR SELECT
  USING (user_id = auth.uid() OR security.is_admin());

CREATE POLICY "logs_delete_admin"
  ON activity_logs FOR DELETE
  USING (security.is_admin());

-- ⑥ 인덱스
CREATE INDEX idx_activity_logs_user    ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
