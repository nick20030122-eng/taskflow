const PATTERNS: { name: string; re: RegExp }[] = [
  { name: "이메일", re: /\b[\w.+]+@[\w.-]+\.[a-z]{2,}\b/i },
  { name: "전화번호", re: /\b\d{2,3}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/ },
  { name: "OpenAI API 키", re: /sk-[A-Za-z0-9_-]{10,}/ },
  { name: "Slack Webhook URL", re: /https:\/\/hooks\.slack\.com\/services\/[A-Z0-9/]+/i },
];

export function checkSensitive(text: string): { blocked: boolean; reason?: string } {
  for (const { name, re } of PATTERNS) {
    if (re.test(text)) return { blocked: true, reason: `민감정보 감지: ${name}` };
  }
  return { blocked: false };
}
