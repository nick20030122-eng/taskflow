import { NextRequest, NextResponse } from "next/server";
import { sendAlert } from "@/lib/events/alert";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.headers.get("x-test-alert-token");
  if (!token || token !== process.env.TEST_ALERT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await sendAlert("error", "테스트 알림 (task.create_failed)", {
    errorCode: "TEST-000",
    operation: "test-alert",
  });

  return NextResponse.json({ ok: true, message: "Alert sent" });
}
