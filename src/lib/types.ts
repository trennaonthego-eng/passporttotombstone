export type Category =
  | "Lodging"
  | "Dining"
  | "Attractions"
  | "Shopping"
  | "Services";

export type Tier = "free" | "featured" | "premium_featured" | "event_host";

export interface Business {
  id: string;
  name: string;
  category: Category;
  subcategory: string | null;
  description: string;
  story: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string;
  tier: Tier;
  event_host: boolean;
  event_types: string[];
  event_capacity: string | null;
  is_featured_on_homepage: boolean;
  featured_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSignup {
  id?: string;
  email: string;
  subscribed_at?: string;
  unsubscribed_at?: string | null;
}

export type EventType =
  | "Corporate Retreat"
  | "Conference"
  | "Film Festival"
  | "Wedding"
  | "Other";

export interface EventInquiry {
  id?: string;
  event_name: string;
  event_type: EventType;
  attendee_count: number;
  preferred_dates: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  message: string;
  venue_inquiries?: string[];
  status?: "new" | "contacted" | "booked" | "closed";
  created_at?: string;
}

export interface ItineraryItem {
  id: string; // business id, or `event:<calendar event index>`, or `townevent:<id>`
  kind: "business" | "calendar-event" | "town-event";
  name: string;
  category?: string;
  note?: string; // e.g. date/time label for events
}

export interface Itinerary {
  id?: string;
  share_slug: string;
  user_id?: string | null;
  title: string;
  items: ItineraryItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Partnership {
  id?: string;
  business_id: string;
  partnership_type:
    | "story"
    | "featured"
    | "premier"
    | "event_host"
    | "newsletter_sponsor";
  tier: string;
  monthly_price: number;
  status: "active" | "pending" | "expired";
  starts_at?: string;
  expires_at?: string;
  contact_email: string;
  contact_phone?: string;
}
