const RESPONSES = {
  pricing:
    "Thanks for reaching out. Based on your message, I would recommend the Pro plan because it includes all major channels, AI replies, voice calls, and analytics. Would you like me to send a pricing summary or book a quick demo?",
  demo: "Absolutely. I can schedule a product demo this week. Tuesday at 10:00 AM or Thursday at 2:00 PM are open. Which slot should I reserve?",
  support:
    "I can help with that. Please share the account email and a short description of what is not working. I will prioritize this and keep the conversation updated.",
  booking:
    "Perfect. I can help book that now. Please send the preferred date, time, phone number, and any special notes, and I will confirm the appointment.",
  default:
    "Thanks for the context. I understand the request and can help move this forward. The best next step is to confirm the goal, timeline, and preferred contact method.",
};

function smartReply(message = "") {
  const lower = message.toLowerCase();
  if (/(price|pricing|cost|plan|billing|package|paid)/.test(lower)) return RESPONSES.pricing;
  if (/(demo|trial|show|walkthrough|see)/.test(lower)) return RESPONSES.demo;
  if (/(help|issue|problem|error|broken|support)/.test(lower)) return RESPONSES.support;
  if (/(book|appointment|schedule|meeting|call)/.test(lower)) return RESPONSES.booking;
  return RESPONSES.default;
}

async function geminiReply(message: string, conversation: unknown[], tone = "professional") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are Voxora AI, a concise ${tone} customer conversation assistant. Reply with one useful business response.\n\nConversation context:\n${JSON.stringify(
                  conversation || [],
                )}\n\nLatest message: ${message}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) return null;
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { message = "", conversation = [], tone = "professional", mode = "demo" } = body;

  const reply =
    mode === "real"
      ? (await geminiReply(message, conversation, tone).catch(() => null)) ||
        smartReply(message)
      : smartReply(message);

  return new Response(reply, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Content-Length": String(new TextEncoder().encode(reply).length),
      Connection: "close",
    },
  });
}
