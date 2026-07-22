"use client";

export function ProductSkeleton() {
  return (
    <div className="bg-white border border-[#d4d5d8] flex flex-col lg:flex-row gap-[24px] lg:h-[166px] items-center p-[17px] relative rounded-[12px] w-full animate-pulse select-none">
      {/* Product Image Skeleton */}
      <div className="bg-neutral-100 rounded-[8px] shrink-0 w-[120px] h-[120px]" />

      {/* Details Skeleton */}
      <div className="flex-1 flex flex-col gap-[16px] py-[4px] w-full">
        <div className="flex flex-col gap-[8px]">
          <div className="flex gap-[12px] items-center">
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
            <div className="h-5 bg-neutral-200 rounded w-16" />
          </div>
          <div className="h-4 bg-neutral-100 rounded w-2/3" />
          <div className="h-4 bg-neutral-100 rounded w-1/2" />
        </div>
        <div className="h-6 bg-neutral-200 rounded w-24" />
      </div>

      {/* Attributes Skeleton */}
      <div className="flex flex-wrap lg:flex-nowrap gap-[24px] lg:gap-[32px] items-center w-full lg:w-auto shrink-0 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-100">
        <div className="flex flex-col gap-[16px] min-w-[150px] w-[190px]">
          {/* Colors */}
          <div className="flex flex-col gap-[8px]">
            <div className="h-4 bg-neutral-200 rounded w-12" />
            <div className="flex gap-[8px]">
              <div className="w-[16px] h-[16px] rounded-full bg-neutral-200" />
              <div className="w-[16px] h-[16px] rounded-full bg-neutral-200" />
            </div>
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-[8px]">
            <div className="h-4 bg-neutral-200 rounded w-10" />
            <div className="flex gap-[8px]">
              <div className="w-[24px] h-[26px] bg-neutral-100 rounded" />
              <div className="w-[24px] h-[26px] bg-neutral-100 rounded" />
              <div className="w-[24px] h-[26px] bg-neutral-100 rounded" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-[50px] bg-neutral-200 shrink-0" />

        {/* Gallery */}
        <div className="flex flex-col gap-[8px] justify-center min-w-[100px]">
          <div className="h-4 bg-neutral-200 rounded w-14" />
          <div className="h-5 bg-neutral-100 rounded w-16" />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-[50px] bg-neutral-200 shrink-0" />

        {/* Quantity */}
        <div className="flex flex-col gap-[8px] justify-center min-w-[100px]">
          <div className="h-4 bg-neutral-200 rounded w-14" />
          <div className="h-5 bg-neutral-100 rounded w-8" />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] h-[72px] bg-neutral-200 shrink-0" />

        {/* Action Buttons */}
        <div className="flex lg:flex-col gap-[8px] justify-end items-center shrink-0 w-full lg:w-[100px]">
          <div className="h-[36px] bg-neutral-200 rounded-[16px] w-full" />
          <div className="h-[36px] bg-neutral-200 rounded-[16px] w-full" />
        </div>
      </div>
    </div>
  );
}
