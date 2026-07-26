"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { X, Plus, ImagePlus, ChevronDown } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { createProductSchema } from "../schema";
import { updateProductListAction } from "../actions/products.actions";
import { ProductStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/app/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_DIM = 1000;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get 2D context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

type EditProductFormValues = z.infer<typeof createProductSchema>;

interface LocalizedString {
  en: string;
  ar: string;
}

interface ProductVariant {
  colorHex: string | null;
  images: string[];
}

interface EditProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: LocalizedString;
    description: LocalizedString;
    price: number;
    sizes: string[];
    variants: ProductVariant[];
    quantity?: number;
    status?: ProductStatus;
  };
}

export function EditProductDrawer({ isOpen, onClose, product }: EditProductDrawerProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<EditProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      price: undefined,
      quantity: undefined,
      status: ProductStatus.PUBLISHED,
      sizes: [],
      variants: [],
    },
  });

  const { fields: variants, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Populate data when drawer opens or product changes
  useEffect(() => {
    if (isOpen && product) {
      reset({
        nameEn: product.name.en || "",
        nameAr: product.name.ar || "",
        descriptionEn: product.description.en || "",
        descriptionAr: product.description.ar || "",
        price: product.price,
        quantity: product.quantity ?? 0,
        status: product.status ?? ProductStatus.PUBLISHED,
        sizes: product.sizes || [],
        variants: product.variants.map((v) => ({
          colorHex: v.colorHex || "",
          images: v.images || [],
        })),
      });
    }
  }, [isOpen, product, reset]);

  const sizes = watch("sizes") || [];
  const watchedVariants = watch("variants") || [];

  const handleAddColor = (colorHex: string) => {
    if (watchedVariants.some((v: any) => v.colorHex.toLowerCase() === colorHex.toLowerCase())) {
      toast.error("This color has already been added.");
      return;
    }
    append({ colorHex, images: [] });
  };

  const handleFileSelectForVariant = (index: number, files: FileList) => {
    const fileArray = Array.from(files);
    const currentImages = watchedVariants[index]?.images || [];
    
    if (currentImages.length + fileArray.length > 4) {
      toast.error("You can upload a maximum of 4 images for a single color.");
      return;
    }

    const validFiles = fileArray.filter((file) => {
      const isValidType = ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length < fileArray.length) {
      toast.error("Some files were skipped. Only PNG, JPG, and WEBP under 5MB are allowed.");
    }

    const promises = validFiles.map((file) => compressImage(file));

    Promise.all(promises)
      .then((base64Urls) => {
        const updatedImages = [...currentImages, ...base64Urls];
        setValue(`variants.${index}.images`, updatedImages, { shouldValidate: true });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to process images.");
      });
  };

  const handleRemoveImageFromVariant = (variantIndex: number, imageIndex: number) => {
    const currentImages = watchedVariants[variantIndex]?.images || [];
    const updatedImages = currentImages.filter((_, i) => i !== imageIndex);
    setValue(`variants.${variantIndex}.images`, updatedImages, { shouldValidate: true });
  };

  const onSubmit = async (data: EditProductFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: {
          en: data.nameEn,
          ar: data.nameAr,
        },
        description: {
          en: data.descriptionEn,
          ar: data.descriptionAr,
        },
        price: data.price,
        quantity: data.quantity,
        status: data.status,
        sizes: data.sizes,
        variants: data.variants,
      };

      const res = await updateProductListAction(product.id, JSON.stringify(payload));

      if (res.ok) {
        toast.success(res.message || "Product updated successfully");
        reset();
        onClose();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#1f1f1f]/40 cursor-pointer"
            onClick={submitting ? undefined : onClose}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="relative z-10 w-screen max-w-[504px] bg-white shadow-[-1px_0px_4px_0px_rgba(0,0,0,0.18)] flex flex-col justify-between h-full"
          >
            {/* Form wrapper */}
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between overflow-hidden">
              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto pt-[32px] px-[32px] pb-[20px]">
                <div className="flex flex-col gap-[32px]">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-poppins font-semibold italic text-[28px] text-[#141414] leading-[1.4]">
                      Edit Product
                    </h3>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="bg-white hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center rounded-full shadow-[0px_1px_3px_0px_rgba(0,0,0,0.11)] border border-[#d4d5d8] border-solid size-[36px] cursor-pointer"
                    >
                      <X className="h-5 w-5 text-[#141414]" />
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-[16px] w-full">
                    {/* Name (English) */}
                    <Input
                      label="Product name"
                      {...register("nameEn")}
                      error={errors.nameEn?.message}
                      disabled={submitting}
                    />

                    {/* Name (Arabic) */}
                    <div className="flex w-full flex-col gap-2 text-right">
                      <label className="text-[16px] font-normal leading-normal text-text-label font-poppins select-none w-full">
                        اسم المنتج
                      </label>
                      <Input
                        dir="rtl"
                        {...register("nameAr")}
                        error={errors.nameAr?.message}
                        disabled={submitting}
                        className="text-right"
                      />
                    </div>

                    {/* Short Description (English) */}
                    <div className="flex w-full flex-col gap-2">
                      <label className="text-[16px] font-normal leading-normal text-text-label font-poppins select-none">
                        Short description
                      </label>
                      <div
                        className={cn(
                          "relative flex min-h-[112px] w-full rounded-input border border-border-input bg-bg-input px-3 py-2 transition-colors focus-within:border-border-input-focus focus-within:ring-1 focus-within:ring-border-input-focus",
                          errors.descriptionEn && "border-border-input-error focus-within:border-border-input-error focus-within:ring-border-input-error",
                          submitting && "cursor-not-allowed opacity-60 bg-neutral-100"
                        )}
                      >
                        <textarea
                          {...register("descriptionEn")}
                          disabled={submitting}
                          className="w-full bg-transparent text-[16px] font-normal text-text-input placeholder:text-text-placeholder focus:outline-none disabled:cursor-not-allowed font-poppins resize-none"
                        />
                      </div>
                      {errors.descriptionEn?.message && (
                        <p className="text-xs font-normal text-text-error font-poppins">
                          {errors.descriptionEn.message}
                        </p>
                      )}
                    </div>

                    {/* Short Description (Arabic) */}
                    <div className="flex w-full flex-col gap-2 text-right">
                      <label className="text-[16px] font-normal leading-normal text-text-label font-poppins select-none w-full">
                        وصف المنتج
                      </label>
                      <div
                        className={cn(
                          "relative flex min-h-[112px] w-full rounded-input border border-border-input bg-bg-input px-3 py-2 transition-colors focus-within:border-border-input-focus focus-within:ring-1 focus-within:ring-border-input-focus",
                          errors.descriptionAr && "border-border-input-error focus-within:border-border-input-error focus-within:ring-border-input-error",
                          submitting && "cursor-not-allowed opacity-60 bg-neutral-100"
                        )}
                      >
                        <textarea
                          dir="rtl"
                          {...register("descriptionAr")}
                          disabled={submitting}
                          className="w-full bg-transparent text-[16px] font-normal text-text-input placeholder:text-text-placeholder focus:outline-none disabled:cursor-not-allowed font-poppins resize-none text-right"
                        />
                      </div>
                      {errors.descriptionAr?.message && (
                        <p className="text-xs font-normal text-text-error font-poppins">
                          {errors.descriptionAr.message}
                        </p>
                      )}
                    </div>

                    {/* 3-Column Layout: Price, Quantity, Status */}
                    <div className="flex gap-[16px] items-start w-full">
                      {/* Price */}
                      <div className="flex-1 min-w-0">
                        <Input
                          label="Price (EGP)"
                          type="number"
                          step="0.01"
                          {...register("price", { valueAsNumber: true })}
                          error={errors.price?.message}
                          disabled={submitting}
                        />
                      </div>

                      {/* Quantity */}
                      <div className="flex-1 min-w-0">
                        <Input
                          label="Quantity"
                          type="number"
                          {...register("quantity", { valueAsNumber: true })}
                          error={errors.quantity?.message}
                          disabled={submitting}
                        />
                      </div>

                      {/* Status */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <label className="text-[16px] font-normal leading-normal text-text-label font-poppins select-none">
                          Status
                        </label>
                        <div className="relative w-full">
                          <select
                            {...register("status")}
                            disabled={submitting}
                            className="h-[48px] w-full rounded-input border border-border-input bg-bg-input px-3 pr-10 text-[16px] text-text-input focus:outline-none focus:border-border-input-focus focus:ring-1 focus:ring-border-input-focus appearance-none font-poppins cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <option value={ProductStatus.PUBLISHED}>Published</option>
                            <option value={ProductStatus.DRAFT}>Draft</option>
                            <option value={ProductStatus.ARCHIVED}>Archived</option>
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <ChevronDown className="h-5 w-5" />
                          </div>
                        </div>
                        {errors.status?.message && (
                          <p className="text-xs font-normal text-text-error font-poppins">
                            {errors.status.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sizes Selection */}
                    <div className="flex flex-col gap-2 w-full">
                      <span className="text-[14px] font-medium leading-normal text-[#464646] font-poppins select-none">
                        Sizes
                      </span>
                      <div className="flex gap-[8px] flex-wrap items-center">
                        {sizeOptions.map((size) => {
                          const isSelected = sizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              disabled={submitting}
                              onClick={() => {
                                const nextSizes = isSelected
                                  ? sizes.filter((s: string) => s !== size)
                                  : [...sizes, size];
                                setValue("sizes", nextSizes, { shouldValidate: true });
                              }}
                              className={cn(
                                "border border-[#d4d5d8] border-solid flex items-center justify-center px-[9px] py-[5px] rounded-[4px] h-[31px] min-w-[28px] font-poppins font-normal text-[14px] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
                                isSelected
                                  ? "bg-[#141414] text-white border-[#141414]"
                                  : "bg-white text-[#464646] hover:bg-neutral-50"
                              )}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                      {errors.sizes?.message && (
                        <p className="text-xs font-normal text-text-error font-poppins mt-1">
                          {errors.sizes.message}
                        </p>
                      )}
                    </div>

                    {/* Colors & Variants Section */}
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-normal leading-normal text-[#141414] font-poppins select-none">
                          Colors
                        </span>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => colorInputRef.current?.click()}
                          className="bg-white border border-[#d4d5d8] border-dashed relative rounded-full shrink-0 size-[32px] flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4 text-neutral-600" />
                        </button>
                        <input
                          type="color"
                          ref={colorInputRef}
                          disabled={submitting}
                          className="sr-only"
                          onChange={(e) => {
                            const newColor = e.target.value;
                            if (newColor) {
                              handleAddColor(newColor);
                              e.target.value = "#000000";
                            }
                          }}
                        />
                      </div>
                      {errors.variants?.message && (
                        <p className="text-xs font-normal text-text-error font-poppins mt-1">
                          {errors.variants.message}
                        </p>
                      )}

                      {watchedVariants.map((variant, index) => {
                        const colorHex = variant.colorHex;
                        const imagesList = variant.images || [];
                        const variantError = errors.variants?.[index]?.images;

                        return (
                          <div
                            key={index}
                            className="border border-[#d4d5d8] rounded-[8px] p-4 flex flex-col gap-4 bg-white shadow-sm relative group/section transition-all"
                          >
                            {/* Variant Header: Color Swatch + Hex Input + Remove Color Button */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={colorHex || ""}
                                  disabled={submitting}
                                  onChange={(e) => {
                                    setValue(`variants.${index}.colorHex`, e.target.value, { shouldValidate: true });
                                  }}
                                  className="size-[32px] rounded-full border border-black/10 cursor-pointer overflow-hidden bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none shrink-0"
                                />
                                <span className="font-poppins font-medium text-[14px] text-[#464646]">
                                  {colorHex?.toUpperCase() || ""}
                                </span>
                              </div>

                              <button
                                type="button"
                                disabled={submitting}
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-705 active:scale-95 transition-all cursor-pointer text-sm font-poppins font-medium"
                              >
                                Remove Color
                              </button>
                            </div>

                            {/* Variant Gallery Section */}
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex gap-[8px] items-center font-poppins font-normal text-[14px] select-none">
                                <span className="text-[#ff6b35]">Gallery</span>
                                <span className="text-[#747474] text-[12px]">(exactly 4 images required)</span>
                              </div>

                              {/* Upload Box specific to this variant */}
                              <div
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (submitting) return;
                                  if (e.dataTransfer.files) {
                                    handleFileSelectForVariant(index, e.dataTransfer.files);
                                  }
                                }}
                                onClick={() => {
                                  if (submitting) return;
                                  const inputEl = document.getElementById(`file-input-${index}`);
                                  inputEl?.click();
                                }}
                                className={cn(
                                  "border border-[#d4d5d8] border-dashed flex flex-col gap-[8px] h-[100px] items-center justify-center overflow-clip p-[12px] rounded-[8px] shrink-0 w-full cursor-pointer hover:border-neutral-400 transition-colors bg-white",
                                  submitting && "cursor-not-allowed opacity-60 bg-neutral-100"
                                )}
                              >
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  id={`file-input-${index}`}
                                  disabled={submitting}
                                  className="sr-only"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      handleFileSelectForVariant(index, e.target.files);
                                    }
                                  }}
                                />
                                <ImagePlus className="h-5 w-5 text-neutral-500" />
                                <p className="font-poppins font-normal text-[12px] text-[#464646]">
                                  Click or drag to upload images ({imagesList.length}/4)
                                </p>
                              </div>

                              {/* Thumbnail Preview list */}
                              {imagesList.length > 0 && (
                                <div className="flex gap-[8px] items-start flex-wrap mt-1">
                                  {imagesList.map((img: string, imgIdx: number) => (
                                    <div
                                      key={imgIdx}
                                      className="relative border border-[#d4d5d8] border-dashed rounded-[8px] overflow-hidden size-[60px] shrink-0 group shadow-sm bg-neutral-50"
                                    >
                                      <img alt="" src={img} className="object-cover size-full" />
                                      <button
                                        type="button"
                                        disabled={submitting}
                                        onClick={() => handleRemoveImageFromVariant(index, imgIdx)}
                                        className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Display validation error message for this specific variant */}
                              {variantError?.message && (
                                <p className="text-xs font-normal text-text-error font-poppins mt-1">
                                  {variantError.message}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky/Fixed Footer containing Save Button */}
              <div className="border-t border-[#d4d5d8] bg-white pb-[32px] pt-[12px] px-[32px] flex items-center justify-center w-full">
                <Button variant="primary" size="md" fullWidth type="submit" isLoading={submitting}>
                  Save
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
