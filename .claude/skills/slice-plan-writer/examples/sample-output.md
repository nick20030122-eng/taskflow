# Slice 2 계획서

## 1. Slice 이름

사용자가 태스크 상태를 변경한다

## 2. 연결 PRD Must

- M-02: 태스크 CRUD — 상태 변경 (todo → in_progress → done)

## 3. 연결 백로그

- BL-006: 태스크 상태 변경 (todo / in_progress / done)
- BL-007: 상태 변경 시 updated_at 자동 갱신

## 4. 테이블·컬럼

| 테이블 | 주요 컬럼 |
|--------|----------|
| tasks | id, status, updated_at, team_id, created_by |

## 5. 권한 기준

| 동작 | 권한자 |
|------|--------|
| UPDATE tasks.status | 해당 team_id의 members 소속 유저 (RLS) |
| SELECT tasks | 같은 team_id의 members 소속 유저 (RLS) |

`team_id`는 서버에서 RLS로 재검증 — 클라이언트 입력 신뢰 금지

## 6. 정상 흐름

1. `/tasks` 진입 → 태스크 목록 표시
2. 태스크 옆 상태 셀렉트 클릭 → 드롭다운 (todo / in_progress / done)
3. 새 상태 선택 → Server Action 호출
4. Server Action: 인증 확인 → UPDATE tasks SET status, updated_at → revalidatePath
5. 목록 새로고침 없이 해당 태스크 상태 표시 변경

## 7. 오류 흐름

| 케이스 | 기대 동작 |
|--------|----------|
| 비로그인 상태 접근 | /login 리다이렉트 |
| 타인 팀 태스크 변경 시도 | RLS UPDATE 차단 (에러 반환) |
| 유효하지 않은 status 값 | Server Action 입력 검증 오류 반환 |
| 네트워크 오류 | 에러 메시지 표시, 상태 롤백 |

## 8. 완료 증거

- [ ] 정상 동작: 상태 변경 후 목록 즉시 반영 (localhost)
- [ ] 유효하지 않은 status 값 → 에러 처리 확인
- [ ] 로그아웃 후 /tasks 접근 → /login 리다이렉트 확인
- [ ] 계정 A/B: B가 A 태스크 상태 변경 불가 확인 (RLS)
- [ ] `pnpm build` 성공
