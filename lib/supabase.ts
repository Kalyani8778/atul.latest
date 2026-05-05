import { createBrowserClient } from "@supabase/ssr";

// createBrowserClient stores the session in cookies (not localStorage) so that
// the Next.js middleware can read it server-side for route protection.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
