export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// export const BASE_URL = "http://localhost:3000"
// export const BASE_URL = "https://om-shree-ganeshay-namah-git-development4-roker15.vercel.app"
// export const BASE_URL = "http://localhost:3000"
// export const BASE_URL = "https://qlook.in";
export const BASE_URL = "https://jionote.com";
// export const BASE_URL = "https://om-shree-ganeshay-namah-git-development4-start-roker15.vercel.app/";

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
export const sunEditorButtonList = [
  [
    // "undo",
    // "redo",
    "font",
    "fontSize",
    "formatBlock",
    "paragraphStyle",
    "blockquote",
    "bold",
    "underline",
    "italic",
    "strike",
    "subscript",
    "superscript",
    "fontColor",
    "hiliteColor",
    "textStyle",
    "removeFormat",
    "outdent",
    "indent",
    "align",
    // "horizontalRule",
    "list",
    // "lineHeight",
    "table",
    "link",
    "image",
    // "video",
    // "audio",
    "math",
    // "imageGallery",
    // "fullScreen",
    // "showBlocks",
    // "codeView",
    // "preview",
    "print",
    // "save",
    // "template",
  ],
];
// export const sunEditorButtonList = [
//   // ["undo", "redo"],
//   ["font", "fontSize", "formatBlock"],
//   [/*"paragraphStyle",*/ "blockquote"],
//   ["bold", "underline", "italic", "strike", "subscript", "superscript"],
//   ["fontColor", "hiliteColor", "textStyle"],
//   ["removeFormat"],
//   "/",
//   ["outdent", "indent"],
//   ["align", "horizontalRule", "list" /* "lineHeight"*/],
//   ["table", "link", "image", /* "video","audio",*/ "math"],

//   ["imageGallery"], // You must add the "imageGalleryUrl".
//   // ["fullScreen" /*, "showBlocks", "codeView"*/],
//   [
//     // "preview",
//     "print",
//   ],
//   ["save", "template"],
// ];



export const sunEditorfontList = [
  "Arial",
  "Comic Sans Ms",
  "Tahoma",
  // "Bookman Old Style",
  // "Georgia",
  // "Calibri",
  // "Comic Sans",
  // "Courier",
  // "Garamond",
  // "Impact",
  // "Lucida Console",
  // "Palatino Linotype",
  // "Segoe UI",
  // "Tahoma",
  // "Times New Roman",
  // "Trebuchet MS",
  // "Open Sans",
  // "Roboto Slab",
];
export const colors:any = [
  ["#E1D5E7", "#FFCC99", "#FFFF88", "#CDEB8B"],
  ["#CCE5FF", "#EEEEEE", "#F9F7ED", "#FFCCCC"],
  ["#F5F5F5", "#DAE8FC", "#D5E8D4", "#FFE6CC"],
  ["#FFF2CC", "#F8CECC", "#E1D5E7", "#FFFFFF"],
  ["#76608A", "#647687", "#F0A30A", "#008A00"],
];