"use client";

import { ProductSkeleton } from "@/app/components/ProductSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#eff1f4]">
      {/* Skeleton Nav Bar Header matching Figma Nav Bar size */}
      <header className="bg-white border-b border-neutral-100 flex h-[71px] items-center justify-between pr-[32px] w-full shrink-0 select-none">
        <div className="flex gap-[32px] items-center h-full">
          <div className="bg-[#131827] flex flex-col h-full items-center justify-center px-[32px] w-[239.99px] shrink-0">
            <span className="font-poppins font-bold text-[20px] text-white/50 tracking-[2.5px] uppercase leading-none animate-pulse">
              ALGAMMAL
            </span>
            <span className="font-poppins font-normal text-[10px] text-white/30 tracking-[2.5px] uppercase mt-1 leading-none animate-pulse">
              — INC. —
            </span>
          </div>
          <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-[16px] items-center">
          <div className="h-[36px] w-[150px] bg-neutral-200 rounded-[16px] animate-pulse" />
          <div className="h-[36px] w-[100px] bg-neutral-200 rounded-[16px] animate-pulse" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-[24px] p-[32px] w-full">
        {/* Header Section */}
        <div className="flex flex-col gap-[8px] w-full">
          <div className="flex gap-[12px] items-center w-full">
            <div className="h-10 bg-neutral-200 rounded w-48 animate-pulse" />
            <div className="h-6 w-8 bg-neutral-200 rounded-[9999px] animate-pulse" />
          </div>
          <div className="h-5 bg-neutral-200 rounded w-64 animate-pulse" />
        </div>

        {/* Product Cards List Skeletons */}
        <div className="flex flex-col gap-[16px] w-full">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>

        {/* Footer info skeleton */}
        <div className="flex flex-col items-center pt-[8px] w-full">
          <div className="h-5 bg-neutral-200 rounded w-48 animate-pulse" />
        </div>
      </main>
    </div>
  );
}
