// import { books, books_article_sharing, PrismaClient, profiles } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../../lib/database";
import prisma from "../../../../lib/prisma";
import { toJson } from "../../../../lib/utils";

export type Data_subheadings = {
  id: number;
  sequence: number | null;
  subheading: string | null;
};

export type Data_headings = {
  id: number;
  heading: string | null;
  sequence: number | null;
  books: {
    id: number;
  } | null;
  books_subheadings: Data_subheadings[];
};

export type Data = {
  id: number;
  book_name: string;
  books_headings: Data_headings[];
} | null;

export default async function handle(req: NextApiRequest, res: NextApiResponse<Data | string>) {
  const supabaseServerClient = createServerSupabaseClient<Database>({ req, res });
  // const bookId = Number(req.query.bookId);
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  const { method, } = req;
  console.log("method is ", method);
  const { bookId } = req.query;

  try {
    const posts = await prisma.books.findUnique({
      where: { id: Number(bookId) },
      select: {
        id: true,
        book_name: true,
        books_headings: {
          select: {
            id: true,
            heading: true,
            sequence: true,
            books: { select: { id: true } },
            books_subheadings: { select: { id: true, sequence: true, subheading: true }, orderBy: { sequence: "asc" } },
          },
          orderBy: { sequence: "asc" },
        },
      },
    });
    console.log("api syllabus hit-syllabus");
    // console.log(toJson(posts)!)
    return res.status(200).send(toJson(posts)!);
  } catch (error) {
    return res.status(500).send(toJson(error)!);
    // console.log("message is", (error as any).message, "end");
    // res.status((error as any).requestResult.statusCode).json('User already exists' );
    // throw error;
    // res.status(403).send( "Error occured." );
  }
}
