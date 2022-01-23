export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// export const BASE_URL = "http://localhost:3000"
// export const BASE_URL = "https://om-shree-ganeshay-namah-git-development4-roker15.vercel.app"
// export const BASE_URL = "http://localhost:3000"
// export const BASE_URL = "https://qlook.in";
export const BASE_URL = "https://jionotes.com";

export const DEFAULT_AVATARS_BUCKET = "avatars";

export type Profile = {
  id: string;
  avatar_url: string;
  username: string;
  website: string;
  updated_at: string;
  role: string;
  email: string;
};
