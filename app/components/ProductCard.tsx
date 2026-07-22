"use client";

import { Image as ImageIcon, Package, Edit3, Trash2 } from "lucide-react";
import Image from "next/image";

interface LocalizedString {
  en: string;
  ar: string;
}

interface Variant {
  color: LocalizedString;
  images: string[];
}

interface Product {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  sizes: string[];
  variants: Variant[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: Product;
}

const getColorHex = (colorName: string): string => {
  const name = colorName.toLowerCase().trim();
  switch (name) {
    case "black": return "#1a1a1a";
    case "blue": return "#3b5998";
    case "navy": return "#000080";
    case "gray":
    case "grey": return "#808080";
    case "red": return "#d7110e";
    case "green": return "#44992e";
    case "white": return "#ffffff";
    default: return name;
  }
};

export function ProductCard({ product }: ProductCardProps) {
  // Extract all unique colors across variants
  const colors = Array.from(new Set(product.variants?.map((v) => v.color.en) || []));

  // Extract first image
  const firstImage = product.variants?.[0]?.images?.[0];

  // Calculate total images
  const totalImages = product.variants?.reduce((sum, v) => sum + (v.images?.length || 0), 0) || 0;

  // Deterministic mock quantity (since schema doesn't include quantity, we show e.g. 16 or deterministic number based on price)
  const quantity = Math.max(8, Math.round((product.price % 30) + 10));

  return (
    <div className="bg-white border border-[#d4d5d8] flex flex-col lg:flex-row gap-[24px] lg:h-[166px] items-center p-[17px] relative rounded-[12px] w-full select-none hover:shadow-sm transition-all duration-200">
      {/* Product Image */}
      <div className="bg-[#f3f3f4] relative rounded-[8px] shrink-0 w-[120px] h-[120px] overflow-hidden flex items-center justify-center">
        {firstImage ? (
          <Image
            alt={product.name.en}
            src={firstImage}
            width={120}
            height={120}
            className="object-cover size-full"
            unoptimized
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-neutral-400" />
        )}
      </div>

      {/* Details (Name, Status, Description, Price) */}
      <div className="flex-1 flex flex-col gap-[12px] lg:gap-[16px] py-[4px] min-w-0 w-full">
        <div className="flex flex-col gap-[8px]">
          <div className="flex gap-[12px] items-center w-full">
            <h2 className="font-poppins font-medium text-[19px] text-[#141414] truncate max-w-[300px] leading-tight">
              {product.name.en}
            </h2>
            <div className="bg-[#edf6eb] flex items-center px-[8px] py-[4px] rounded-[4px] shrink-0">
              <span className="font-poppins font-semibold text-[11px] text-[#44992e] leading-none">
                Published
              </span>
            </div>
          </div>
          <p className="font-poppins font-normal text-[14px] text-[#464646] line-clamp-2 leading-relaxed max-w-[500px]">
            {product.description.en}
          </p>
        </div>
        <div className="font-poppins font-medium text-[19px] text-[#141414] leading-none">
          {product.price} EGP
        </div>
      </div>

      {/* Attributes & Info columns */}
      <div className="flex flex-wrap lg:flex-nowrap gap-[24px] lg:gap-[32px] items-center w-full lg:w-auto shrink-0 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-100">
        {/* Colors & Sizes Column */}
        <div className="flex flex-col gap-[16px] min-w-[150px] w-[190px]">
          {/* Colors */}
          <div className="flex flex-col gap-[8px]">
            <span className="font-poppins font-medium text-[14px] text-[#464646] leading-none">
              Colors
            </span>
            <div className="flex gap-[8px] items-center">
              {colors.length > 0 ? (
                colors.map((color, idx) => (
                  <div
                    key={idx}
                    title={color}
                    style={{ backgroundColor: getColorHex(color) }}
                    className="border border-black/10 rounded-full shrink-0 w-[16px] h-[16px]"
                  />
                ))
              ) : (
                <span className="text-xs text-neutral-400 font-poppins">None</span>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-[8px]">
            <span className="font-poppins font-medium text-[14px] text-[#464646] leading-none">
              Sizes
            </span>
            <div className="flex gap-[8px] items-center flex-wrap">
              {product.sizes.length > 0 ? (
                product.sizes.map((size, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#eff1f4] flex items-center justify-center px-[9px] py-[5px] rounded-[4px] shrink-0 h-[26px] min-w-[24px]"
                  >
                    <span className="font-poppins font-normal text-[14px] text-[#464646] leading-none">
                      {size}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-neutral-400 font-poppins">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-[50px] bg-[#d4d5d8] shrink-0" />

        {/* Gallery */}
        <div className="flex flex-col gap-[8px] justify-center min-w-[100px]">
          <span className="font-poppins font-medium text-[14px] text-[#464646] leading-none">
            Gallery
          </span>
          <div className="flex gap-[8px] items-center">
            <ImageIcon className="h-5 w-5 text-[#141414] shrink-0" />
            <span className="font-poppins font-normal text-[14px] text-[#141414] leading-none whitespace-nowrap">
              {totalImages} image{totalImages !== 1 && "s"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-[50px] bg-[#d4d5d8] shrink-0" />

        {/* Quantity */}
        <div className="flex flex-col gap-[8px] justify-center min-w-[100px]">
          <span className="font-poppins font-medium text-[14px] text-[#464646] leading-none">
            Quantity
          </span>
          <div className="flex gap-[8px] items-center">
            <Package className="h-5 w-5 text-[#141414] shrink-0" />
            <span className="font-poppins font-normal text-[14px] text-[#141414] leading-none">
              {quantity}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-[72px] bg-[#d4d5d8] shrink-0" />

        {/* Action Buttons */}
        <div className="flex lg:flex-col gap-[8px] justify-end items-center shrink-0 w-full lg:w-[100px]">
          {/* Edit Button (Design-Only / Disabled) */}
          <button
            disabled
            className="border border-[#d4d5d8] bg-white text-[#141414] flex gap-[8px] h-[36px] items-center justify-center px-[24px] py-[8px] rounded-[16px] shrink-0 font-poppins font-medium text-[16px] text-center w-full cursor-not-allowed opacity-60"
          >
            <Edit3 className="h-4 w-4 shrink-0" />
            <span>Edit</span>
          </button>

          {/* Delete Button (Design-Only / Disabled) */}
          <button
            disabled
            className="border border-[#d4d5d8] bg-white text-red-600 flex items-center justify-center h-[36px] w-full rounded-[16px] shrink-0 cursor-not-allowed opacity-60"
          >
            <Trash2 className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
