// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export type ApiLatestCurrentAffairs = {
  id: number;
  sequence: number | null;
  article_title: string;
  current_affair_tags: number[];
  question_type: string | null;
  question_year: number | null;
  created_at: string,
  created_by: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });
  // // const bookId = Number(req.query.bookId);
 
  // const {
  //   data: { user },
  // } = await supabaseServerClient.auth.getUser();
  console.log("rrrrrrrrrrrrrrrrrrrrrrrr")
  try {
    const data = await prisma.books_articles.findMany({
      where: { books_subheadings: { books_headings: { books_fk: { equals: 220 } } }, profiles: { role: "MODERATOR" } },

      // skip:0,
      take: 10,
      select: {
        id: true,
        article_english: true,
        article_hindi: true,
        created_by:true,
        books_subheadings_fk: true,
        article_title: true,
        created_at:true,
        sequence: true,
        current_affair_tags: true,
        question_type: true,
        question_year: true,
      },
      orderBy: { updated_at: "desc" },
    });
    console.log("rrrrrrrrrrr")
    return res.status(200).send(toJson(data)!);
  } catch (error) {
    return res.status(500).send(toJson(error)!);
  }
}
