-- =============================================================
-- TaskFlow 초기 스키마
-- 생성일: 2026-06-27
-- 엔티티: teams, members, tasks
-- =============================================================

-- -------------------------------------------------------------
-- [1] 테이블 생성 (부모 → 자식 순서)
-- -------------------------------------------------------------

CREATE TABLE teams (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  owner_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE members (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID        NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL CHECK (role IN ('owner', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (team_id, user_id)
);

CREATE TABLE tasks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     UUID        NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'todo'
                          CHECK (status IN ('todo', 'in_progress', 'done', 'archived')),
  priority    TEXT        NOT NULL DEFAULT 'normal'
                          CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  assignee_id UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by  UUID        NOT NULL REFERENCES auth.users(id),
  due_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ          -- NULL = 활성, 값 있으면 소프트 삭제
);

-- -------------------------------------------------------------
-- [2] updated_at 자동 갱신 트리거
-- -------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_updated
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------------------
-- [3] RLS 활성화 (Default Deny — 정책 없으면 전체 차단)
-- -------------------------------------------------------------

ALTER TABLE teams   ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks   ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- [4] teams RLS 정책
-- -------------------------------------------------------------

-- 팀장(owner)이거나 멤버인 경우 조회 가능
CREATE POLICY "teams_select" ON teams FOR SELECT TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- 자신이 owner인 팀만 생성 가능
CREATE POLICY "teams_insert" ON teams FOR INSERT TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));

-- owner만 수정 가능
CREATE POLICY "teams_update" ON teams FOR UPDATE TO authenticated
  USING  (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));

-- owner만 삭제 가능
CREATE POLICY "teams_delete" ON teams FOR DELETE TO authenticated
  USING (owner_id = (SELECT auth.uid()));

-- -------------------------------------------------------------
-- [5] members RLS 정책
-- (재귀 방지: members를 다시 조회하지 않고 teams.owner_id 기준 사용)
-- -------------------------------------------------------------

-- 자신의 멤버 레코드 OR 자신이 owner인 팀의 전체 멤버 조회
CREATE POLICY "members_select" ON members FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR team_id IN (
      SELECT id FROM teams
      WHERE owner_id = (SELECT auth.uid())
    )
  );

-- owner만 멤버 초대(insert) 가능
CREATE POLICY "members_insert" ON members FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams
      WHERE owner_id = (SELECT auth.uid())
    )
  );

-- owner만 멤버 삭제 가능
CREATE POLICY "members_delete" ON members FOR DELETE TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams
      WHERE owner_id = (SELECT auth.uid())
    )
  );

-- -------------------------------------------------------------
-- [6] tasks RLS 정책
-- -------------------------------------------------------------

-- 내가 속한 팀의 태스크 + 삭제되지 않은 것만 조회
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
    AND deleted_at IS NULL
  );

-- 내가 속한 팀에 태스크 생성 가능 (created_by = 나)
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
    AND created_by = (SELECT auth.uid())
  );

-- 내가 속한 팀의 태스크 수정 가능
CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- 내가 속한 팀의 태스크 삭제(소프트) 가능
CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
  );
