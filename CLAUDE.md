# CLAUDE.md — TaskFlow

## 도메인 컨텍스트

**한 줄 정의**: 5인 이하 팀의 PM이 태스크 우선순위를 한 화면에서 파악하고 하루를 시작하는 협업 도구

**핵심 용어**
- `Task`: 팀이 수행해야 하는 작업 단위 (제목·상태·담당자·마감일·우선순위)
- `Team`: 데이터 격리 단위 — 다른 팀의 Task는 절대 조회 불가
- `Member`: Team에 속한 사용자, role은 `owner` | `member`
- `Status`: `todo` | `in_progress` | `done` | `archived`
- `Priority`: `urgent` | `high` | `normal` | `low`

**데이터 경계**: 모든 쿼리는 반드시 `team_id` 조건 포함. Server Action에서만 DB 접근.

---

## 프로젝트 규칙

### 기술 스택
- Next.js 15 (App Router) / React 19 / TypeScript 5 strict
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth + RLS)
- pnpm 11

### 폴더 구조
```
src/
  app/
    (auth)/login, signup
    (dashboard)/tasks, teams, today
    actions/           ← DB 접근 유일 경로 (Server Actions)
  features/
    tasks/             ← TaskCard, TaskList, TaskForm, TaskFilters
    teams/             ← TeamCard, InviteModal
    today/             ← TodayView, DueSoonBadge
  components/ui/       ← Button, Modal, Badge, Skeleton (도메인 로직 없음)
  lib/
    supabase/          ← server.ts(SERVER ONLY), client.ts
    validation/        ← taskSchema, memberSchema
  types/               ← 공통 타입 (Task, Team, Member, Status, Priority)
supabase/
  migrations/          ← SQL 마이그레이션 파일
```

### 코딩 규칙
- TypeScript strict 모드 — `any` 타입 절대 금지, `unknown` 사용
- Server Component 우선: 클라이언트 컴포넌트는 상호작용이 꼭 필요한 경우만 `"use client"`
- DB 접근은 반드시 Server Action (`src/app/actions/`) 또는 Route Handler에서만
- 컴포넌트는 단일 책임 원칙 — 100줄 초과 시 분리 검토
- Tailwind 유틸리티 클래스 사용, 인라인 style 금지

---

## 금지 사항

| 금지 | 이유 |
|------|------|
| `any` 타입 | 타입 안정성 파괴 |
| `console.log` 잔존 | 프로덕션 로그 오염 |
| secret 하드코딩 | 보안 사고 |
| 클라이언트에서 `SUPABASE_SERVICE_ROLE_KEY` 사용 | RLS 우회로 전체 데이터 노출 |
| `NEXT_PUBLIC_`을 비밀 키에 붙이기 | 브라우저에 키 노출 |
| `team_id` 없는 DB 쿼리 | 타 팀 데이터 노출 |

---

## 검증 명령

작업 완료 후 반드시 아래 3개 모두 실행하고 결과를 보고:

```bash
pnpm build       # 빌드 오류 없어야 함
pnpm lint        # ESLint 오류 없어야 함
pnpm typecheck   # TypeScript 오류 없어야 함
```

---

## 출력 형식

코드 작성·수정 후 반드시 아래 형식으로 보고:

```
변경 파일:
- src/app/actions/tasks.ts  — 태스크 CRUD Server Action 추가
- src/types/task.ts         — Task 타입 정의

이유: [변경 이유 한 줄]

검증 결과:
- build: ✅ / ❌ (오류 내용)
- lint: ✅ / ❌
- typecheck: ✅ / ❌
```
