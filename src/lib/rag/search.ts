import { createClient } from "@/lib/supabase/server";
import { embedText } from "./embed";

export type SearchResult = {
  id: string;
  document_name: string;
  chunk_index: number;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
};

export async function searchDocuments(
  query: string,
  threshold = 0.3,
  count = 5
): Promise<SearchResult[]> {
  const supabase = await createClient();
  const embedding = await embedText(query);

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: JSON.stringify(embedding),
    match_threshold: threshold,
    match_count: count,
  });

  if (error) throw new Error(`검색 실패: ${error.message}`);
  return (data ?? []) as SearchResult[];
}
