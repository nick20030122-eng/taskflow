import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAnswer } from "@/lib/rag/generate";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.query) {
    return NextResponse.json({ error: "query 가 필요합니다." }, { status: 400 });
  }

  const result = await generateAnswer(body.query as string);
  return NextResponse.json(result);
}
