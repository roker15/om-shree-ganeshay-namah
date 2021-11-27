import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { DEFAULT_AVATARS_BUCKET } from "../lib/constants";
import Image from "next/image";
import profilePic from "../public/loader.svg";

export default function Avatar({ url, size }: { url: string | null; size: number }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from(DEFAULT_AVATARS_BUCKET).download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  }

  return avatarUrl ? (
    <Image src={avatarUrl} className="avatar image" alt="Picture of the author" />
  ) : (
    // <img src={avatarUrl} className="avatar image" style={{ height: size, width: size }} />
    <Image src={profilePic} alt="Picture of the author" />
    // <div className="avatar no-image" style={{ height: size, width: size }} />
  );
}
