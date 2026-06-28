import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export function splitIntoChunks(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
    i += chunkSize - overlap;
  }

  return chunks;
}

export async function embedText(text: string): Promise<number[]> {
  const res = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

export async function saveChunks(
  teamId: string,
  createdBy: string,
  documentName: string,
  chunks: string[]
): Promise<number> {
  const supabase = await createClient();

  const rows = await Promise.all(
    chunks.map(async (content, index) => ({
      team_id: teamId,
      created_by: createdBy,
      document_name: documentName,
      chunk_index: index,
      content,
      embedding: JSON.stringify(await embedText(content)),
    }))
  );

  const { error } = await supabase.from("document_chunks").insert(rows);
  if (error) throw new Error(`DB 저장 실패: ${error.message}`);

  return rows.length;
}
