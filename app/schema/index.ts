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
  nameEn: z.string().min(1, "Product name (English) is required").trim(),
  nameAr: z.string().min(1, "اسم المنتج مطلوب").trim(),
  descriptionEn: z.string().min(1, "Short description (English) is required").trim(),
  descriptionAr: z.string().min(1, "وصف المنتج مطلوب").trim(),
  price: z.number({ message: "Price must be a number" }).positive("Price must be greater than 0"),
  quantity: z.number({ message: "Quantity must be a number" }).int("Quantity must be an integer").nonnegative("Quantity cannot be negative"),
  status: z.nativeEnum(ProductStatus),
  sizes: z.array(z.string()).min(1, "At least one size must be selected"),
  variants: z
    .array(
      z.object({
        colorHex: z.string().min(1, "Color is required"),
        images: z
          .array(z.string())
          .min(4, "Each color must contain exactly 4 images.")
          .max(4, "Each color must contain exactly 4 images."),
      })
    )
    .min(1, "At least one color variant must be added"),
});
