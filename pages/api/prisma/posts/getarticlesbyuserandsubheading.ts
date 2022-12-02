// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export type ApiArticleTitle = {
  id: number;
  sequence: number | null;
  article_title: string;
  current_affair_tags: number[];
  question_type: string | null;
  question_year: number | null;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });
  // const bookId = Number(req.query.bookId);
  const {
    query: { subheadingId, creatorId },
    method,
  } = req;
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  try {
    const data = await prisma.books_articles.findMany({
      where: { books_subheadings_fk: Number(subheadingId), created_by: creatorId.toString() },
      select: {
        id: true,
        books_subheadings_fk:true,
        article_title: true,
        sequence: true,
        current_affair_tags: true,
        question_type: true,
        question_year: true,
      },
    });
    return res.status(200).send(toJson(data)!);
  } catch (error) {
    return res.status(500).send(toJson(error)!);
  }
}
