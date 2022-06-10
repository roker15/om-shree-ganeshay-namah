import { createClient } from "@supabase/supabase-js";
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from "./constants";

if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
const options = {
  schema: "public",
  headers: { "x-my-custom-header": "jionote" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};
export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
