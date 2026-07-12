import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminConfigured = Boolean(
  supabaseUrl && serviceRoleKey && process.env.ADMIN_PASSWORD
);

let client: SupabaseClient | null = null;
if (supabaseUrl && serviceRoleKey) {
  client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/** Server-only Supabase client with service-role privileges (bypasses RLS).
 *  Never import from client components. */
export function getAdminSupabase(): SupabaseClient | null {
  return client;
}

/** Constant-shape check for the admin password sent as a Bearer token. */
export function isAuthorized(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${expected}`;
}
