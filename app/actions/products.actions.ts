"use server";

import { prisma } from "../lib/prisma";
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

export const getProductsListAction = async () => {
    const products = await prisma.product.findMany()
    return products
}


export const createProductListAction = async ({description,name,price,sizes,variants}:Iproduct) => {
    try {
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
        return { ok: true, message: "Product created successfully" }
    } catch (error) {
        console.error("Failed to create product:", error);
        return { ok: false, message: error instanceof Error ? error.message : "An unexpected error occurred" }
    }
}


export const deleteProductListAction = async ({id}:{id:string}) => {
    try {
        await prisma.product.delete({
            where:{
                id,
            }
        })
        // For Update data after delete
        revalidatePath('/')
        return { ok: true, message: "Product deleted successfully" }
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { ok: false, message: error instanceof Error ? error.message : "An unexpected error occurred" }
    }
}




