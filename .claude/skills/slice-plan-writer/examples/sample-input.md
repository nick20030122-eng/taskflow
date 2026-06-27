# 테스트 입력 — slice-plan-writer

slice_name: 사용자가 태스크 상태를 변경한다
prd_must: M-02: 태스크 CRUD (상태 변경)
backlog_ids: BL-006, BL-007
target_table: tasks — id, status, updated_at
auth_rule: 팀 멤버(members 소속)만 자신의 팀 태스크 상태 변경 가능 (RLS: team_id 일치)
day_number: 9
slice_number: 2
