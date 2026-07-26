import { z } from "zod";
import { ProductStatus } from "@prisma/client";

export const loginformSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .trim(),
    
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  description: z.string().min(1, "Short description is required").trim(),
  price: z.number({ message: "Price must be a number" }).positive("Price must be greater than 0"),
  quantity: z.number({ message: "Quantity must be a number" }).int("Quantity must be an integer").nonnegative("Quantity cannot be negative"),
  status: z.nativeEnum(ProductStatus),
  sizes: z.array(z.string()).min(1, "At least one size must be selected"),
  colors: z.array(z.string()).min(1, "At least one color must be selected"),
  images: z.array(z.string()).min(1, "At least one image must be uploaded"),
});
