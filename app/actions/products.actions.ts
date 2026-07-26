"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma/client";


interface LocalizedString {
  en :string
  ar: string
}

interface Variant {
 colorHex :string | null
  images: string[]
}


interface Iproduct {

  name        :   LocalizedString
  description :   LocalizedString
  price :    number
  quantity : number
  status:   ProductStatus
  sizes   :   string[]
  variants  :    Variant[]
}

export const getProductsListAction = async () => {
    const products = await prisma.product.findMany()
    return products
}


export const createProductListAction = async (payload: Iproduct | string) => {
    try {
        const data = typeof payload === "string" ? (JSON.parse(payload) as Iproduct) : payload;
        const { description, name, price, sizes, variants, quantity, status } = data;
        await prisma.product.create(
            {data:
                {
                    description,
                    name,
                    price,
                    sizes,
                    variants,
                    quantity,
                    status
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


export const updateProductListAction = async (id: string, payload: Iproduct | string) => {
    try {
        const data = typeof payload === "string" ? (JSON.parse(payload) as Iproduct) : payload;
        const { description, name, price, sizes, variants, quantity, status } = data;
        await prisma.product.update({
            where: {
                id,
            },
            data: {
                description,
                name,
                price,
                sizes,
                variants,
                quantity,
                status
            }
        })
        // to update data after update
        revalidatePath('/')
        return { ok: true, message: "Product updated successfully" }
    } catch (error) {
        console.error("Failed to update product:", error);
        return { ok: false, message: error instanceof Error ? error.message : "An unexpected error occurred" }
    }
}




