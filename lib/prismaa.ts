import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const prismaTest = async () => {
  const allUsers = await prisma.books.findFirst();
  console.log(allUsers);
};
