import { books, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Fetch all posts (in /pages/api/posts.ts)
const prisma = new PrismaClient();
function toJson(data: any) {
  if (data !== undefined) {
      return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
          .replace(/"(-?\d+)#bigint"/g, (_, a) => a);
  }
}
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  console.log("hi");
  const posts = await prisma.books.findMany();
  console.log(posts)
  //   return posts;
  return res.status(200).send(posts)
}
