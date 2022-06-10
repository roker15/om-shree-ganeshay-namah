import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
 // Set the auth cookie.
 supabase.auth.api.setAuthCookie(req, res);
}