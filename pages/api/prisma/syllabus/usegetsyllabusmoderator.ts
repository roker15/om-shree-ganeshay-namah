// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export type SyllabusModerator = {
  id: number;
  is_active: boolean;
  profiles: {
    id: string;
    username: string | null;
    role: string | null;
    email: string | null;
  } | null;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse<SyllabusModerator[] | string>) {
  const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });
  // const bookId = Number(req.query.bookId);
  const {
    query: { bookId },
    method,
  } = req;
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  try {
    const posts = await prisma.syllabus_moderator.findMany({
      where: { book_fk: Number(bookId) },
      select: { id: true,is_active:true, profiles: { select: { id: true, email: true, username: true, role: true } } },
    });
    return res.status(200).send(toJson(posts)!);
  } catch (error) {
    return res.status(500).send(toJson(error)!);
  }
}
