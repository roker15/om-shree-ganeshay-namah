export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// export const BASE_URL = "http://localhost:3000"
// export const BASE_URL = "https://om-shree-ganeshay-namah-git-development4-roker15.vercel.app"
// export const BASE_URL = "http://localhost:3000"
// export const BASE_URL = "https://qlook.in";
export const BASE_URL = "https://jionote.com";

// npx openapi-typescript https://hbvffqslxssdbkdxfqop.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDIyNjQxOCwiZXhwIjoxOTQ1ODAyNDE4fQ.CCZ3y_Mzp5HjQJnuEXqL5Wq4tk2ZjZj97gVkODFYNh4 --output types/supabase.ts  

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
