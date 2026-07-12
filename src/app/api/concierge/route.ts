import { anthropicReply } from "@/lib/concierge";

interface ConciergeBody {
  message?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(request: Request) {
  let body: ConciergeBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > 1000) {
    return Response.json({ error: "Message is too long." }, { status: 400 });
  }

  const history = (body.history ?? []).slice(-8);
  const { reply, matches } = await anthropicReply(message, history);

  return Response.json({
    reply,
    suggestions: matches.map((m) => m.item),
  });
}
