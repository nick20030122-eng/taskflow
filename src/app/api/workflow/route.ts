import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runWorkflow } from "@/lib/workflow/engine";
import { searchStep, summarizeStep, reportStep, notifyStep } from "@/lib/workflow/steps";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = (await request.json()) as { query?: string };
  if (!body.query) return NextResponse.json({ error: "검색 쿼리를 입력해주세요." }, { status: 400 });

  const steps = [searchStep, summarizeStep, reportStep, notifyStep];
  const { results, finalOutput } = await runWorkflow(steps, { query: body.query });

  const runId = `run-${user.id.slice(0, 8)}-${Date.now()}`;
  return NextResponse.json({ runId, query: body.query, results, finalOutput });
}
