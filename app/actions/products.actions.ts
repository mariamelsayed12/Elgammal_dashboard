import { PrismaClient } from "@prisma/client";


let prisma: PrismaClient;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export const getProductsListAction = async () => {
    const products = await getPrisma().product.findMany()
    return products
}



