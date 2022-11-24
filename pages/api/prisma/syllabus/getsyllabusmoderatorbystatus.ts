// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export type SyllabusModerator2 = {
  id: number;
  is_active: boolean;
  books: {
    id: number;
    book_name: string;
  };
  profiles: {
    id: string;
    role: string | null;
    username: string | null;
    email: string | null;
  } | null;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse<SyllabusModerator2[] | string>) {
  const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });
  // const bookId = Number(req.query.bookId);
  const {
    query: { status },
    method,
  } = req;
  const isActive = status === "true";
  console.log("status is ",isActive)
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  try {
    const moderator = await prisma.syllabus_moderator.findMany({
      where: { is_active: isActive },
      select: {
        id: true,
        is_active: true,
        profiles: { select: { id: true, email: true, username: true, role: true } },
        books: { select: { id: true, book_name: true } },
      },
    });
    return res.status(200).send(toJson(moderator)!);
  } catch (error) {
    return res.status(500).send(toJson(error)!);
  }
}
