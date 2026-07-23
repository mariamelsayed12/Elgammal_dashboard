import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";



interface LocalizedString {
  en :string
  ar: string
}

interface Variant {
  color:  LocalizedString
  images: string[]
}

interface Iproduct {

  name        :   LocalizedString
  description :   LocalizedString

  price :    number
  sizes   :   string[]
  variants  :    Variant[]
}
 


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


export const createProductListAction = async ({description,name,price,sizes,variants}:Iproduct) => {

    await prisma.product.create(
        {data:
            {
                description,
                name,
                price,
                sizes,
                variants,
            }
            
        }
    )
    // to update data after create
    revalidatePath('/')
    
}



