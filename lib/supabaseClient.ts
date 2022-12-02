import { AuthSessionMissingError, createClient } from "@supabase/supabase-js";
import { NextApiRequest } from "next";
import { NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL } from "./constants";

if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");

// export async function supabaseServerClient(context: { req: NextApiRequest }) {
//   const access_token = context.req.cookies["supabase-access-token"];

//   if (!access_token) throw new AuthSessionMissingError();

//   const supabaseClient = createClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     auth: {
//       autoRefreshToken: false,
//       detectSessionInUrl: false,
//       persistSession: false,
//     },
//     global: {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     },
//   });

//   return supabaseClient;
// }
