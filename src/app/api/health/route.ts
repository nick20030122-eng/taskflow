import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(): Promise<NextResponse> {
  const envChecks: Record<string, boolean> = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
  };

  let supabase_connection = false;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase.from("teams").select("id").limit(1);
    supabase_connection = !error;
  } catch {
    supabase_connection = false;
  }

  const allEnvSet = Object.values(envChecks).every(Boolean);
  const status = allEnvSet && supabase_connection ? "ok" : "degraded";

  return NextResponse.json(
    { status, checks: { env: envChecks, supabase_connection } },
    { status: status === "ok" ? 200 : 503 }
  );
}
