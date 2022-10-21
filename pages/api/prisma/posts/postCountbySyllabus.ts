// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export type Data1 = {
  count: number;
} | null;

export default async function handle(req: NextApiRequest, res: NextApiResponse<Data1 | string>) {
  const subheadingId = Number(req.query.subheadingId);
  const creatorId = req.query.creatorId as string;

  const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  // req.body.param.answer;
  console.log("parameter issss  ", req.query.subheadingId);
  const c = "hello world";
  try {
    const posts = await prisma.books_articles.count({
      where: { books_subheadings_fk: subheadingId, created_by: creatorId },
    });
    console.log("count is ", toJson(posts)!);
    return res.status(200).send(toJson(posts)!);
  } catch (error) {
    // console.log("message is", (error as any).message, "end");
    // res.status((error as any).requestResult.statusCode).json('User already exists' );
    throw error;
    // res.status(403).send( "Error occured." );
  }
}
