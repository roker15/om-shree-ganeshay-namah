import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the auth cookie.
//   console.log("calling auth api",req.cookies,req.body.session.user.user_metadata);
  supabase.auth.api.setAuthCookie(req, res);
}
