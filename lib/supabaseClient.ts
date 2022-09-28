import {  createClient } from "@supabase/supabase-js";
import { GetServerSideProps, NextApiRequest } from "next";
// import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from "./constants";
import { Database } from "./database.types";

if (!NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
// const options = {
//   schema: "public",
//   headers: { "x-my-custom-header": "jionote" },
//   autoRefreshToken: true,
//   persistSession: true,
//   detectSessionInUrl: true,
// };
// export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, options);

export const supabaseClient = createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
// export const supabaseClient1 = supabaseClient<Database>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
export async function supabaseServerClient(
    context:{req:NextApiRequest} 
  ) {
    const access_token = context.req.cookies['supabase-access-token']
  
    if (!access_token) throw new AuthSessionMissingError()
  
    const supabaseClient = createClient(
      NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      }
    )
  
    return supabaseClient
  }
  
//   // On an API function or getServerSideProps
//   export default function handler({req, res}) {
//     const supabase = await supabaseServerClient({ req })
  
//     // queries will be scoped to the user
//     const { data } = await supabase.from('table')...
  
//   }