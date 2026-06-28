-- =============================================================
-- Day 12: RAG 설정
-- pgvector 확장 + document_chunks 테이블 + RLS + match_documents 함수
-- =============================================================

-- [1] pgvector 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- [2] document_chunks 테이블
CREATE TABLE document_chunks (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id       UUID        NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by    UUID        NOT NULL REFERENCES auth.users(id),
  document_name TEXT        NOT NULL,
  chunk_index   INTEGER     NOT NULL,
  content       TEXT        NOT NULL,
  embedding     vector(1536),
  metadata      JSONB       DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- [3] RLS 활성화 (Default Deny)
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- SELECT: 내 팀 문서만 조회
CREATE POLICY "doc_chunks_select" ON document_chunks FOR SELECT TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- INSERT: 내 팀에 저장, 본인 created_by 강제
CREATE POLICY "doc_chunks_insert" ON document_chunks FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
    AND created_by = (SELECT auth.uid())
  );

-- UPDATE: 내 팀 문서만 수정
CREATE POLICY "doc_chunks_update" ON document_chunks FOR UPDATE TO authenticated
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

-- DELETE: 내 팀 문서만 삭제
CREATE POLICY "doc_chunks_delete" ON document_chunks FOR DELETE TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM members
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- [4] match_documents 함수 (SECURITY INVOKER — 호출자의 RLS 적용)
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count     INT   DEFAULT 5
)
RETURNS TABLE (
  id            UUID,
  document_name TEXT,
  chunk_index   INTEGER,
  content       TEXT,
  metadata      JSONB,
  similarity    FLOAT
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    dc.id,
    dc.document_name,
    dc.chunk_index,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$$;
