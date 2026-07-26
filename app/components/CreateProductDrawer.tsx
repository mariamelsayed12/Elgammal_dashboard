"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { X, Plus, ImagePlus, ChevronDown } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { createProductSchema } from "../schema";
import { createProductListAction } from "../actions/products.actions";
import { ProductStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/app/lib/utils";

type CreateProductFormValues = z.infer<typeof createProductSchema>;

interface CreateProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProductDrawer({ isOpen, onClose }: CreateProductDrawerProps) {
  const router = useRouter();
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      quantity: undefined,
      status: ProductStatus.PUBLISHED,
      sizes: [],
      colors: [],
      images: [],
    },
  });

  const colors = watch("colors") || [];
  const sizes = watch("sizes") || [];
  const images = watch("images") || [];

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValidType = ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length < fileArray.length) {
      toast.error("Some files were skipped. Only PNG, JPG, and WEBP under 5MB are allowed.");
    }

    const promises = validFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(new Error("File read error"));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Urls) => {
        setValue("images", [...images, ...base64Urls], { shouldValidate: true });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to process images.");
      });
  };

  const onSubmit = async (data: CreateProductFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: {
          en: data.name,
          ar: data.name,
        },
        description: {
          en: data.description,
          ar: data.description,
        },
        price: data.price,
        quantity: data.quantity,
        status: data.status,
        sizes: data.sizes,
        variants: data.colors.map((color, idx) => ({
          colorHex: color,
          images: idx === 0 ? data.images : [],
        })),
      };

      const res = await createProductListAction(JSON.stringify(payload));

      if (res.ok) {
        toast.success(res.message || "Product created successfully");
        reset();
        onClose();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-[#1f1f1f]/40 transition-opacity duration-300 ease-in-out cursor-pointer",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={submitting ? undefined : onClose}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          className={cn(
            "w-screen max-w-[504px] bg-white shadow-[-1px_0px_4px_0px_rgba(0,0,0,0.18)] flex flex-col justify-between transform transition-transform duration-300 ease-in-out",
            isVisible ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Form wrapper */}
          <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto pt-[32px] px-[32px] pb-[20px]">
              <div className="flex flex-col gap-[32px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-semibold italic text-[28px] text-[#141414] leading-[1.4]">
                    Add Product
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
                  {/* Name */}
                  <Input
                    label="Product name"
                    {...register("name")}
                    error={errors.name?.message}
                    disabled={submitting}
                  />

                  {/* Short Description */}
                  <div className="flex w-full flex-col gap-2">
                    <label className="text-[16px] font-normal leading-normal text-text-label font-poppins select-none">
                      Short description
                    </label>
                    <div
                      className={cn(
                        "relative flex min-h-[112px] w-full rounded-input border border-border-input bg-bg-input px-3 py-2 transition-colors focus-within:border-border-input-focus focus-within:ring-1 focus-within:ring-border-input-focus",
                        errors.description && "border-border-input-error focus-within:border-border-input-error focus-within:ring-border-input-error",
                        submitting && "cursor-not-allowed opacity-60 bg-neutral-100"
                      )}
                    >
                      <textarea
                        {...register("description")}
                        disabled={submitting}
                        className="w-full bg-transparent text-[16px] font-normal text-text-input placeholder:text-text-placeholder focus:outline-none disabled:cursor-not-allowed font-poppins resize-none"
                      />
                    </div>
                    {errors.description?.message && (
                      <p className="text-xs font-normal text-text-error font-poppins">
                        {errors.description.message}
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

                  {/* Colors Selection */}
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-[16px] font-normal leading-normal text-[#141414] font-poppins select-none">
                      Colors
                    </span>
                    <div className="flex flex-wrap gap-[8px] items-center">
                      {colors.map((color: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          title="Click to remove color"
                          disabled={submitting}
                          onClick={() => {
                            setValue(
                              "colors",
                              colors.filter((c: string) => c !== color),
                              { shouldValidate: true }
                            );
                          }}
                          style={{ backgroundColor: color }}
                          className="relative rounded-full size-[32px] border border-black/10 shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3 text-white" />
                          </span>
                        </button>
                      ))}
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
                          if (newColor && !colors.includes(newColor)) {
                            setValue("colors", [...colors, newColor], { shouldValidate: true });
                          }
                        }}
                      />
                    </div>
                    {errors.colors?.message && (
                      <p className="text-xs font-normal text-text-error font-poppins mt-1">
                        {errors.colors.message}
                      </p>
                    )}
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

                  {/* Gallery (Recommended 4 Images) */}
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-[8px] items-center font-poppins font-normal text-[16px] select-none">
                      <span className="text-[#ff6b35]">Gallery</span>
                      <span className="text-[#747474] text-[14px]">(recommended 4 images)</span>
                    </div>

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
                          handleFileSelect(e.dataTransfer.files);
                        }
                      }}
                      onClick={() => !submitting && fileInputRef.current?.click()}
                      className={cn(
                        "border border-[#d4d5d8] border-dashed flex flex-col gap-[8px] h-[117px] items-center justify-center overflow-clip p-[12px] rounded-[8px] shrink-0 w-full cursor-pointer hover:border-neutral-400 transition-colors bg-white",
                        submitting && "cursor-not-allowed opacity-60 bg-neutral-100"
                      )}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        disabled={submitting}
                        className="sr-only"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFileSelect(e.target.files);
                          }
                        }}
                      />
                      <ImagePlus className="h-6 w-6 text-neutral-500" />
                      <p className="font-poppins font-normal text-[14px] text-[#464646]">
                        Click to upload images
                      </p>
                      <p className="font-poppins font-normal text-[12px] text-[#464646]">
                        PNG, JPG, WEBP max 5 MB each
                      </p>
                    </div>

                    {/* Thumbnail list */}
                    {images.length > 0 && (
                      <div className="flex gap-[8px] items-start flex-wrap mt-2">
                        {images.map((img: string, idx: number) => (
                          <div
                            key={idx}
                            className="relative border border-[#d4d5d8] border-dashed rounded-[8px] overflow-hidden size-[70px] shrink-0 group shadow-sm bg-neutral-50"
                          >
                            <img alt="" src={img} className="object-cover size-full" />
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => {
                                setValue(
                                  "images",
                                  images.filter((_, i) => i !== idx),
                                  { shouldValidate: true }
                                );
                              }}
                              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-0 disabled:cursor-not-allowed"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.images?.message && (
                      <p className="text-xs font-normal text-text-error font-poppins mt-1">
                        {errors.images.message}
                      </p>
                    )}
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
        </div>
      </div>
    </div>
  );
}
