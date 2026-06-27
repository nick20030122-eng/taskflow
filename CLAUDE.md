# CLAUDE.md — TaskFlow 정식판

## 1. Project Purpose

**서비스**: 5~20인 스타트업 팀의 PM이 태스크 우선순위를 한 화면에서 파악하고 하루를 시작하는 협업 도구  
**대상 사용자**: 소규모 스타트업 팀의 PM·팀 리더  
**핵심 가치**: 로그인 후 /today 화면에서 오늘 집중할 태스크를 추가 클릭 없이 파악

---

## 2. Current State

### 완료
- Supabase 연결 (teams / members / tasks 테이블 + RLS 9개 정책)
- SECURITY DEFINER 함수(`get_my_team_ids`)로 재귀 방지
- SEO 메타데이터·sitemap·robots·JSON-LD 적용
- 랜딩 페이지(`/`) 제품 카피 적용

### 진행 중 (Day 7)
- Slice 1: 로그인 → 태스크 생성 → 목록 조회

### 미시작
- 팀 생성·멤버 초대 UI
- 우선순위·담당자 필터
- 오늘 할 일 요약 뷰 (`/today`)
- Vercel 배포

---

## 3. Project Structure

```
src/
  app/
    (auth)/login/page.tsx          ← 로그인 페이지
    (auth)/signup/page.tsx         ← 회원가입 페이지
    (dashboard)/layout.tsx         ← 인증 Guard (미로그인 → /login)
    (dashboard)/tasks/page.tsx     ← 태스크 목록 + 생성 폼
    actions/
      auth.ts                      ← 로그인·가입·로그아웃 Server Action
      tasks.ts                     ← 태스크 CRUD Server Action
  features/
    tasks/components/
      CreateTaskForm.tsx            ← 태스크 생성 폼 (Client Component)
      TaskList.tsx                  ← 태스크 목록 (Server Component)
  components/ui/                   ← Button, Modal 등 공통 UI
  lib/supabase/
    server.ts                      ← ⚠️ SERVER ONLY
    client.ts                      ← NEXT_PUBLIC_* 변수만
  types/index.ts                   ← Task, Team, Member 타입
supabase/migrations/               ← SQL 마이그레이션 파일
```

---

## 4. Coding Rules

- **Server Component 우선**: `"use client"`는 상호작용이 꼭 필요한 경우만
- **DB 접근 경로**: `src/app/actions/` 또는 Server Component 직접 쿼리만
- **mutations**: Server Action (`actions/`) 에서만
- **queries**: Server Component에서 직접 Supabase 호출
- **`created_by`**: 절대 클라이언트 hidden input 금지 — 서버에서 `user.id` 강제
- **TypeScript strict**: `any` 금지, `unknown` 사용
- **`revalidatePath`**: INSERT/UPDATE/DELETE 후 반드시 호출
- **`auth.getUser()`**: 모든 Server Action 첫 줄에서 호출 (getSession 금지)
- 주석 없음 원칙 — 이유가 자명하지 않은 경우만 예외

---

## 5. Security Rules

| 금지 | 이유 |
|------|------|
| `SUPABASE_SERVICE_ROLE_KEY` 클라이언트 노출 | RLS 우회 → 전체 데이터 노출 |
| `NEXT_PUBLIC_` 접두사 비밀 키 | 브라우저 번들에 포함됨 |
| 클라이언트 `user.id` / `team_id` 신뢰 | 위·변조 가능 — 항상 서버에서 재확인 |
| `getSession()` 인증 판단 | 클라이언트 캐시 신뢰 금지 — `getUser()` 사용 |
| `team_id` 없는 DB 쿼리 | 타 팀 데이터 노출 |
| `any` 타입 | 타입 안정성 파괴 |
| `console.log` 잔존 | 프로덕션 로그 오염 |

---

## 6. Domain Context

**핵심 용어**
- `Task`: 팀이 수행할 작업 단위 (title, status, priority, assignee_id, due_date)
- `Team`: 데이터 격리 단위 — 다른 팀 데이터는 RLS가 DB 레벨에서 차단
- `Member`: Team에 속한 사용자, role = `owner` | `member`
- `Status`: `todo` → `in_progress` → `done` | `archived`
- `Priority`: `urgent` | `high` | `normal` | `low`

**비즈니스 로직**
- 모든 쿼리: `team_id` 조건 필수
- soft delete: `tasks.deleted_at` 설정 (물리 삭제 없음)
- North Star 지표: 팀당 주간 task.completed 수
- `get_my_team_ids()`: SECURITY DEFINER 함수 — members RLS 재귀 방지용

---

## 7. Verification Commands

작업 완료 후 반드시 3개 모두 실행:

```bash
pnpm build       # 빌드 오류 없어야 함
pnpm lint        # ESLint 오류 없어야 함
pnpm typecheck   # TypeScript 오류 없어야 함
```

보고 형식:
```
변경 파일: [파일 목록]
이유: [한 줄]
결과: build ✅ lint ✅ typecheck ✅
```

---

## 8. Decision Log

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2026-06-27 | `@supabase/ssr` 쿠키 세션 채택 | Server Component 세션 접근 + XSS 방지 |
| 2026-06-27 | members RLS에 `SECURITY DEFINER` 함수 도입 | members ↔ teams 재귀 방지 |
| 2026-06-27 | AI 기능 Won't scope 유지 | PRD 범위 외, MVP 집중 |
| 2026-06-27 | `metadataBase`: taskflow.vercel.app (임시) | 배포 확정 전 플레이스홀더 |
