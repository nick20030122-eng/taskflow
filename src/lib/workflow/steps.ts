import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { searchDocuments } from "@/lib/rag/search";
import { WorkflowSkip, type WorkflowStep } from "./engine";
import { checkSensitive } from "./securityGate";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

type SearchOutput = {
  query: string;
  results: Array<{ content: string; document_name: string; chunk_index: number; similarity: number }>;
};

type SummarizeOutput = {
  query: string;
  summary: string;
  score: number;
  iterations: number;
};

type ReportOutput = {
  report: string;
  filename: string;
};

export const searchStep: WorkflowStep = {
  name: "search",
  required: true,
  timeoutMs: 8000,
  run: async (input) => {
    const { query } = input as { query: string };
    const results = await searchDocuments(query, 0.3, 5);
    if (results.length === 0) {
      throw Object.assign(new Error("NO_RESULTS"), { errorCode: "NO_RESULTS" });
    }
    const output: SearchOutput = { query, results };
    return { output, summary: `${results.length}개 청크 검색됨 (최고 유사도 ${results[0].similarity.toFixed(2)})` };
  },
};

export const summarizeStep: WorkflowStep = {
  name: "summarize",
  required: true,
  timeoutMs: 15000,
  run: async (input) => {
    const { query, results } = input as SearchOutput;
    const context = results.map((r, i) => `[${i + 1}] ${r.content}`).join("\n\n");
    const openai = getOpenAI();

    const MIN_SCORE = 75;
    const MAX_ITERATIONS = 3;
    let summary = "";
    let score = 0;
    let iterations = 0;

    while (iterations < MAX_ITERATIONS) {
      iterations++;

      const genRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "아래 문서 내용을 기반으로 질문에 답하세요. 문서에 없는 내용은 추측하지 마세요. 출처를 반드시 인용하세요.",
          },
          { role: "user", content: `질문: ${query}\n\n문서:\n${context}` },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });
      summary = genRes.choices[0].message.content ?? "";

      const evalRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "요약 품질을 100점 만점으로 평가하세요. 기준: 출처 인용(33점) + 핵심 누락 없음(34점) + 적절한 길이(33점). 숫자만 반환하세요.",
          },
          { role: "user", content: `질문: ${query}\n\n요약:\n${summary}` },
        ],
        max_tokens: 5,
        temperature: 0,
      });
      score = parseInt(evalRes.choices[0].message.content?.trim() ?? "0", 10);
      if (isNaN(score)) score = 0;
      if (score >= MIN_SCORE) break;
    }

    const output: SummarizeOutput = { query, summary, score, iterations };
    return { output, summary: `요약 완료 (점수 ${score}/100, ${iterations}회 반복)` };
  },
};

export const reportStep: WorkflowStep = {
  name: "report",
  required: true,
  timeoutMs: 8000,
  run: async (input) => {
    const { query, summary, score, iterations } = input as SummarizeOutput;
    const report = [
      "# 워크플로 리포트",
      "",
      "## 질문",
      query,
      "",
      "## 답변 요약",
      summary,
      "",
      "## 품질 정보",
      `- 점수: ${score}/100`,
      `- 개선 반복 횟수: ${iterations}회`,
    ].join("\n");

    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
    const filename = `report-workflow.md`;
    fs.writeFileSync(path.join(reportsDir, filename), report, "utf-8");

    const output: ReportOutput = { report, filename };
    return { output, summary: `보고서 생성됨: reports/${filename}` };
  },
};

export const notifyStep: WorkflowStep = {
  name: "notify",
  required: false,
  timeoutMs: 5000,
  run: async (input) => {
    const { report } = input as ReportOutput;

    const gate = checkSensitive(report);
    if (gate.blocked) throw new WorkflowSkip("SEND_BLOCKED");

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) throw new WorkflowSkip("NO_WEBHOOK");

    const text = report.length > 400 ? report.slice(0, 400) + "..." : report;
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw Object.assign(new Error("SLACK_ERROR"), { errorCode: "SLACK_ERROR" });

    return { output: { sent: true }, summary: "Slack 알림 전송 완료" };
  },
};
