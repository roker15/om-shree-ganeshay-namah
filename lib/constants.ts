import dynamic from "next/dynamic";

export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const BASE_URL = "http://www.localhost:3000";
// export const BASE_URL = "https://www.jionote.com";
// export const BASE_URL = "https://om-shree-ganeshay-namah-git-dev-only-jionote-v2-roker15.vercel.app";

// npx openapi-typescript https://hbvffqslxssdbkdxfqop.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDIyNjQxOCwiZXhwIjoxOTQ1ODAyNDE4fQ.CCZ3y_Mzp5HjQJnuEXqL5Wq4tk2ZjZj97gVkODFYNh4 --output types/supabase.ts

export const DEFAULT_AVATARS_BUCKET = "avatars";
export const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
export type Profile = {
  id: string;
  avatar_url: string;
  username: string;
  website: string;
  updated_at: string;
  role: string;
  email: string;
  last_login: string;
};
export const sunEditorButtonList = [
  [
    // "undo",
    // "redo",
    "font",
    "fontSize",
    "formatBlock",
    // "paragraphStyle",
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
    "save",
    // "template",
  ],
];

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
export const colors: any = [
  ["#F25022", "#7FBA00", "#00A4EF", "#FFB900"],
  ["#737373", "#E0E0E0", "#CC99FF", "#FFCCCC"],
  ["#F5F5F5", "#DAE8FC", "#D5E8D4", "#FFE6CC"],
  ["#FFF2CC", "#F8CECC", "#E1D5E7", "#FFFFFF"],
  ["#76608A", "#647687", "#F0A30A", "#008A00"],
];
export const currentAffairTags: { id: number; tag: string }[] = [
  { id: 1, tag: "Newspaper" },
  { id: 2, tag: "Yojna" },
  { id: 3, tag: "Kurukshetra" },
  { id: 5, tag: "PIB" },
  { id: 4, tag: "Other sources" },
  { id: 6, tag: "National" },
  { id: 7, tag: "International" },

  { id: 201, tag: "Previous year Questions ⭐" },
  { id: 202, tag: "Model Questions" },

  { id: 8, tag: "Indian Heritage, Art and Culture ⭐" },

  { id: 9, tag: "Polity & Governance ⭐" },
  { id: 10, tag: "Constitution" },
  { id: 11, tag: "Union, States and federal structure" },
  { id: 12, tag: "Executive and the Judiciary" },
  { id: 13, tag: "Constitutional posts and Bodies" },
  { id: 14, tag: "quasi-judicial bodies" },

  { id: 15, tag: "Social Issue & Social Justice ⭐" },
  { id: 16, tag: "Welfare schemes" },
  { id: 17, tag: "poverty and hunger" },
  { id: 18, tag: "Social Sector/Services relating to Health" },
  { id: 181, tag: "Social Sector/Services relating to Education" },
  { id: 182, tag: "Social Sector/Services relating to Human Resources" },

  { id: 19, tag: "International Relations ⭐" },
  { id: 20, tag: "India - neighborhood relations" },
  { id: 21, tag: "global groupings and agreements" },
  { id: 22, tag: "regional groupings and agreements" },
  { id: 23, tag: "Bilateral groupings and agreements" },
  { id: 24, tag: "Important International institutions, agencies and fora- their structure, mandate" },
  { id: 601, tag: "United Nations & specialized agencies" },

  { id: 25, tag: "Science & Technology ⭐" },
  { id: 26, tag: "New Technology" },
  { id: 27, tag: "indigenization of Technology" },
  { id: 28, tag: "Defence" },
  { id: 29, tag: "IT & Computers" },
  { id: 30, tag: "Space" },
  { id: 31, tag: "Robitics" },
  { id: 32, tag: "Nano-Technology" },
  { id: 33, tag: "Bio-Tech" },
  { id: 34, tag: "Intellectual property rights" },

  { id: 35, tag: "Indian Economy ⭐" },
  { id: 36, tag: "Inclusive growth" },
  { id: 37, tag: "Employment" },
  { id: 38, tag: "Budgeting" },
  { id: 39, tag: "Indian Economy" },
  { id: 40, tag: "Agriculture, Food Processing & Allied Sector" },
  { id: 41, tag: "Farm subsidies and MSP" },
  { id: 42, tag: "PDS and food security" },
  { id: 43, tag: "Land reforms" },
  { id: 44, tag: "Infrastructure" },

  { id: 45, tag: "Biodiversity ⭐" },

  { id: 46, tag: "Ecology & Environment ⭐" },
  { id: 47, tag: "environmental impact assessment" },
  { id: 48, tag: "environmental pollution and degradation" },
  { id: 49, tag: "environmental Conservation" },

  { id: 50, tag: "National Security ⭐" },
  { id: 51, tag: "Internal security" },
  { id: 52, tag: "Cyber security" },
  { id: 53, tag: "Media, Social media and security" },
  { id: 54, tag: "Money Laundering" },
  { id: 55, tag: "Security forces and agencies" },

  { id: 56, tag: "Disaster Management ⭐" },
  
  { id: 501, tag: "Ethics ⭐" },

  { id: 57, tag: "Miscellaneous ⭐" },
  { id: 571, tag: "Person in News" },
  { id: 572, tag: "Place in News" },
  { id: 572, tag: "Geography" },
  { id: 58, tag: "Sustainable Developement" },
  { id: 59, tag: "Bills/Acts" },
  { id: 60, tag: "Study/Survey/Report/Index" },
];

