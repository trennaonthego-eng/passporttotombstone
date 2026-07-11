import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVENT_TYPES = ["Corporate Retreat", "Conference", "Film Festival", "Wedding", "Other"];

interface InquiryBody {
  event_name?: string;
  event_type?: string;
  attendee_count?: number;
  preferred_dates?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  message?: string;
  venue_inquiries?: string[];
}

export async function POST(request: Request) {
  let body: InquiryBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const errors: string[] = [];
  if (!body.event_name?.trim()) errors.push("Event name is required.");
  if (!body.event_type || !EVENT_TYPES.includes(body.event_type))
    errors.push("Please choose a valid event type.");
  if (!body.attendee_count || body.attendee_count < 1)
    errors.push("Expected attendees must be at least 1.");
  if (!body.preferred_dates?.trim()) errors.push("Preferred dates are required.");
  if (!body.contact_name?.trim()) errors.push("Contact name is required.");
  if (!body.contact_email || !EMAIL_RE.test(body.contact_email))
    errors.push("A valid contact email is required.");

  if (errors.length > 0) {
    return Response.json({ error: errors.join(" ") }, { status: 400 });
  }

  const inquiry = {
    event_name: body.event_name!.trim(),
    event_type: body.event_type,
    attendee_count: body.attendee_count,
    preferred_dates: body.preferred_dates!.trim(),
    contact_name: body.contact_name!.trim(),
    contact_email: body.contact_email!.trim().toLowerCase(),
    contact_phone: body.contact_phone?.trim() ?? "",
    message: body.message?.trim() ?? "",
    venue_inquiries: body.venue_inquiries ?? [],
    status: "new",
  };

  if (!isSupabaseConfigured) {
    console.warn(
      `[event-inquiry] Supabase not configured — inquiry not persisted:`,
      JSON.stringify(inquiry)
    );
    return Response.json({ ok: true, persisted: false });
  }

  const supabase = getSupabase()!;
  const { error } = await supabase.from("event_inquiries").insert(inquiry);

  if (error) {
    console.error("[event-inquiry] insert failed:", error.message);
    return Response.json(
      { error: "Could not send your inquiry. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
