---
description: "Create a Vertical Slice planning document (8-section table). Use when starting a new feature slice and needing slice_plan.md with PRD mapping, table/column reference, auth rules, normal/error flows, and completion criteria."
---

# slice-plan-writer

## What This Skill Does

주어진 기능 정보를 바탕으로 핸드북 표준 8칸 Slice 계획서(`slice{N}_plan.md`)를 생성합니다.
PRD Must 연결, 백로그 ID 매핑, 테이블·컬럼 정의, 권한 기준, 정상/오류 흐름, 완료 증거를 포함합니다.

## Inputs

- **slice_name**: "사용자가 하는 행동" 한 문장 (예: "사용자가 태스크 상태를 변경한다")
- **prd_must**: 연결할 PRD Must 항목 (예: M-02: 태스크 CRUD)
- **backlog_ids**: 연결 백로그 ID 목록 (예: BL-006, BL-007)
- **target_table**: 대상 테이블명과 주요 컬럼 (예: tasks — status, updated_at)
- **auth_rule**: INSERT/UPDATE/SELECT 권한 기준 (예: 팀 멤버만 수정 가능)
- **day_number**: 현재 Day 번호 (파일명 생성용, 예: 9)
- **slice_number**: 슬라이스 번호 (예: 2)

## Process

1. 입력값 7개 모두 확인 — 누락 있으면 즉시 되묻기 (추측 절대 금지)
2. slice_name이 "한 사람이 한 번 하는 행동" 1개인지 확인 — 범위가 넓으면 분리 제안
3. 8칸 표 생성:
   - **칸 1** — Slice 이름: slice_name 그대로
   - **칸 2** — 연결 PRD Must: prd_must 기재
   - **칸 3** — 연결 백로그: backlog_ids + 각 BL 한 줄 설명
   - **칸 4** — 테이블·컬럼: target_table 기반 마크다운 표
   - **칸 5** — 권한 기준: auth_rule → INSERT/SELECT/UPDATE 행으로 분리
   - **칸 6** — 정상 흐름: 1~5단계 번호 목록
   - **칸 7** — 오류 흐름: 빈 입력·비로그인·타인 접근 최소 3케이스 표
   - **칸 8** — 완료 증거: 체크박스 목록 (정상·빈입력·로그아웃·A/B격리·pnpm build)
4. 파일명 형식: `slice{slice_number}_plan.md`

## Output

`DAY{day_number}/slice{slice_number}_plan.md` 형식의 마크다운 파일:

```markdown
# Slice {N} 계획서

## 1. Slice 이름
[사용자 행동 1문장]

## 2. 연결 PRD Must
[PRD 항목]

## 3. 연결 백로그
- BL-0XX: [설명]

## 4. 테이블·컬럼
| 테이블 | 주요 컬럼 |
|--------|----------|
| [테이블명] | [컬럼 목록] |

## 5. 권한 기준
| 동작 | 권한자 |
|------|--------|
| [동작] | [권한자] |

## 6. 정상 흐름
1. [단계 1]
2. [단계 2]

## 7. 오류 흐름
| 케이스 | 기대 동작 |
|--------|----------|
| 빈 입력 | [예상 결과] |
| 비로그인 접근 | /login 리다이렉트 |
| 타인 접근 | RLS 차단 (빈 응답) |

## 8. 완료 증거
- [ ] 정상 동작 (localhost)
- [ ] 빈 입력 에러 확인
- [ ] 로그아웃 후 차단 확인
- [ ] A/B 계정 격리 확인
- [ ] `pnpm build` 성공
```

## Safety Rules

- Use dummy examples only; never real customer data.
- Do not include .env.local values, API keys, or service role keys.
- Do not modify any source files (.ts, .tsx, .sql) — output markdown only.
- If any required input is missing, stop and ask what is missing instead of guessing.
- Do not expand scope — if slice_name covers more than one user action, suggest splitting first.
