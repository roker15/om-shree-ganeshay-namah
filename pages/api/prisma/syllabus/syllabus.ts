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

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

 
  try {
    const posts = await prisma.books.findUnique({
      where: { id: 125 },
      select: {
        id: true,
        book_name: true,
        books_headings: {
          select: {
            id:true,
            heading: true,
            sequence: true,
            books: { select: { id: true } },
            books_subheadings: { select: { id: true, sequence: true, subheading: true }, orderBy: { sequence: "asc" } },
          },
          orderBy: { sequence: "asc" },
        },
      },
    });
    console.log("api syllabus hit-syllabus")
    // console.log(toJson(posts)!)
    return res.status(200).send(toJson(posts)!);
  } catch (error) {
    // console.log("message is", (error as any).message, "end");
    // res.status((error as any).requestResult.statusCode).json('User already exists' );
    throw error;
    // res.status(403).send( "Error occured." );
  }
}
