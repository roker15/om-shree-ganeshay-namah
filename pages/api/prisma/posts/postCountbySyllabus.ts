// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export default async function handle(req: NextApiRequest, res: NextApiResponse<number | string>) {
  const subheadingId = Number(req.query.subheadingId);
  const creatorId = req.query.creatorId as string;

  const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  try {
    const posts = await prisma.books_articles.count({
      where: { books_subheadings_fk: subheadingId, created_by: creatorId },
    });
    // console.log("count is ", toJson(posts)!);
    console.log("api syllabus hit-counter");
    return res.status(200).send(toJson(posts)!);
  } catch (error: any) {
    res.status(500).send(error.message);
    throw error;
  }
}
