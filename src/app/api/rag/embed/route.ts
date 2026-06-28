import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { splitIntoChunks, saveChunks } from "@/lib/rag/embed";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.documentName || !body?.content || !body?.teamId) {
    return NextResponse.json(
      { error: "documentName, content, teamId 가 필요합니다." },
      { status: 400 }
    );
  }

  const { documentName, content, teamId } = body as {
    documentName: string;
    content: string;
    teamId: string;
  };

  const chunks = splitIntoChunks(content);
  const chunkCount = await saveChunks(teamId, user.id, documentName, chunks);

  return NextResponse.json({ ok: true, chunkCount });
}
