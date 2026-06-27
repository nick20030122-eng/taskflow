import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 더미 태스크 — 실제 DB/이메일/개인정보 없음
const DEMO_TASKS = [
  { id: "demo-1", title: "랜딩 페이지 카피 수정", status: "done", priority: "high", updatedAt: "2026-06-27T10:00:00Z" },
  { id: "demo-2", title: "로그인 폼 검증 추가", status: "in_progress", priority: "normal", updatedAt: "2026-06-27T09:30:00Z" },
  { id: "demo-3", title: "RLS 정책 테스트", status: "todo", priority: "urgent", updatedAt: "2026-06-27T09:00:00Z" },
  { id: "demo-4", title: "sitemap.xml 생성", status: "done", priority: "low", updatedAt: "2026-06-26T18:00:00Z" },
  { id: "demo-5", title: "pnpm build 오류 수정", status: "done", priority: "high", updatedAt: "2026-06-26T17:00:00Z" },
];

const server = new Server(
  { name: "task-reader", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_recent_tasks",
      description:
        "Return recent demo tasks. Fields: id, title, status, priority, updatedAt only — no personal data or credentials.",
      inputSchema: {
        type: "object" as const,
        properties: {
          limit: {
            type: "number",
            description: "Max tasks to return (1–10, default 5)",
          },
        },
        required: [],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "list_recent_tasks") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const raw = request.params.arguments?.limit;
  const limit = Math.min(Math.max(Number(raw ?? 5), 1), 10);
  const tasks = DEMO_TASKS.slice(0, limit);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(tasks, null, 2),
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
