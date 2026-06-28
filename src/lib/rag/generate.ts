import OpenAI from "openai";
import { searchDocuments, type SearchResult } from "./search";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export type GenerateResult = {
  answer: string;
  sources: Pick<SearchResult, "document_name" | "chunk_index" | "similarity">[];
};

export async function generateAnswer(query: string): Promise<GenerateResult> {
  const results = await searchDocuments(query, 0.3, 5);

  if (results.length === 0) {
    return {
      answer: "관련 문서를 찾을 수 없습니다. 더 구체적인 질문을 시도해 주세요.",
      sources: [],
    };
  }

  const context = results.map((r, i) => `[${i + 1}] ${r.content}`).join("\n\n");

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "당신은 팀 태스크 관리 도구의 AI 어시스턴트입니다. 아래 문서 내용만을 근거로 답변하세요. 문서에 없는 내용은 추측하지 마세요.",
      },
      {
        role: "user",
        content: `문서:\n${context}\n\n질문: ${query}`,
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });

  return {
    answer: completion.choices[0].message.content ?? "",
    sources: results.map((r) => ({
      document_name: r.document_name,
      chunk_index: r.chunk_index,
      similarity: r.similarity,
    })),
  };
}
