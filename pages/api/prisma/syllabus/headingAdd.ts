// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export type Data = {
  id: bigint;
  book_name: string;
  books_headings: {
    id: number;
    heading: string | null;
    sequence: bigint | null;
    books: {
      id: bigint;
    } | null;
    books_subheadings: {
      id: number;
      sequence: bigint | null;
      subheading: string | null;
    }[];
  }[];
} | null;

export default async function handle(req: NextApiRequest, res: NextApiResponse<Data | string>) {
  const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });
  const bookId = Number(req.query.bookId);
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  try {
    console.log("mehod is ", req.method);
    console.log("body is ", req.body);
    // const heading = req.body as books
    if (req.method === "POST") {
      const posts = await prisma.books_headings.create({
        data: req.body,
      });
    }

    console.log("api syllabus hit-syllabus");
    // console.log(toJson(posts)!)
    // return res.status(200).send(toJson(posts)!);
  } catch (error) {
    return res.status(500).send(toJson(error)!);
  }
}
