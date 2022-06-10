import { NextApiRequest, NextApiResponse } from "next";
import * as formidable from "formidable";
import { Files } from "formidable";
import { v4 as uuid } from "uuid";
import error from "next/error";
import { supabase } from "../../lib/supabaseClient";
import fs from "fs";
export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(req: NextApiRequest, res: NextApiResponse, file: string) {
  let error1 = null;
  let publicurl = null;
  let name = null;
  // let
  // supabase.auth.api.setAuthCookie(req, res)
  // Get our logged user

  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (user == null) {
    console.log("not user");
  } else {
    console.log("user hai" + user.email);
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, async (err, fields, files: Files) => {
    console.log("bhai ye hai" + JSON.parse(JSON.stringify(files["file-0"]))[0].filepath);
    const user1 = JSON.parse(JSON.stringify(files["file-0"]))[0];
    console.log("filepath: " + user1.filepath);
    const rawData = fs.readFileSync(user1.filepath);
    if (err) {
      error1 = err;
    }
    const filepath = uuid() + "-" + user1.originalFilename;
    name = filepath;
    const { data, error } = await supabase.storage.from("notes-images").upload(filepath, rawData, {
      contentType: user1.mimetype,
      cacheControl: "3600",
      upsert: true,
    });
    if (error) {
      console.log("error is" + JSON.stringify(error));
    }
    if (data) {
      console.log("data is ", data.Key);
      const { publicURL, error } = supabase.storage.from("notes-images").getPublicUrl(filepath);
      publicurl = publicURL;
      console.log("public url is  ", publicURL);
      //   if (publicURL && mountedRef.current == true) {
      //     setFilelist((oldArray) => [...oldArray, { file: file.name, link: publicURL }]);
      //   }
      
    
      res.status(200).json({
        errorMessage: error,
        result: [
          {
            url: publicURL,
            name: "name",
            // size: "561276",
          },
        ],
      });
    
    }
      
  });

 
}
