type AlertLevel = "error" | "warn";

const LEVEL_EMOJI: Record<AlertLevel, string> = {
  error: ":red_circle:",
  warn: ":warning:",
};

export async function sendAlert(
  level: AlertLevel,
  message: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fields = Object.entries(data)
    .map(([k, v]) => `• *${k}*: ${String(v)}`)
    .join("\n");

  const payload = {
    username: "TaskFlow Alert",
    icon_emoji: LEVEL_EMOJI[level],
    text: `${LEVEL_EMOJI[level]} *[${level.toUpperCase()}] ${message}*\n${fields}\n• *timestamp*: ${new Date().toISOString()}`,
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // 알림 실패는 무시 — 핵심 기능에 영향 없어야 함
  }
}
