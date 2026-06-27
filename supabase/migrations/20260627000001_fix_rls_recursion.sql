-- =============================================================
-- RLS 재귀 방지 수정
-- 원인: teams 정책이 members를 조회하고, members 정책이 teams를 조회하면서
--       서로가 서로를 무한 호출하는 순환 참조 발생
-- 해결: SECURITY DEFINER 함수(get_my_team_ids)로 RLS 우회 경로 생성
-- =============================================================

-- [1] SECURITY DEFINER 함수
-- RLS를 우회해 members를 직접 조회 → 정책 내 재귀 차단
CREATE OR REPLACE FUNCTION get_my_team_ids()
RETURNS SETOF UUID LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT team_id FROM members WHERE user_id = auth.uid()
$$;

-- [2] 재귀를 일으키는 기존 정책 삭제
DROP POLICY IF EXISTS "teams_select"   ON teams;
DROP POLICY IF EXISTS "members_select" ON members;
DROP POLICY IF EXISTS "tasks_select"   ON tasks;
DROP POLICY IF EXISTS "tasks_insert"   ON tasks;
DROP POLICY IF EXISTS "tasks_update"   ON tasks;
DROP POLICY IF EXISTS "tasks_delete"   ON tasks;

-- [3] teams: members 직접 조회 제거 → get_my_team_ids() 사용
CREATE POLICY "teams_select" ON teams FOR SELECT TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR id IN (SELECT get_my_team_ids())
  );

-- [4] members: get_my_team_ids()는 SECURITY DEFINER라 재귀 없음
CREATE POLICY "members_select" ON members FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR team_id IN (SELECT get_my_team_ids())
  );

-- [5] tasks: 전부 get_my_team_ids() 로 교체
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated
  USING (
    team_id IN (SELECT get_my_team_ids())
    AND deleted_at IS NULL
  );

CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (SELECT get_my_team_ids())
    AND created_by = (SELECT auth.uid())
  );

CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated
  USING  (team_id IN (SELECT get_my_team_ids()))
  WITH CHECK (team_id IN (SELECT get_my_team_ids()));

CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated
  USING (team_id IN (SELECT get_my_team_ids()));
