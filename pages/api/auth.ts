import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the auth cookie.
//   console.log("calling auth api",req.cookies,req.body.session.user.user_metadata);
supabaseClient.auth.api.setAuthCookie(req, res);
}
