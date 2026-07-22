"use client";

import { PackageOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div className="bg-white border border-[#d4d5d8] rounded-[12px] p-12 w-full flex flex-col items-center justify-center text-center select-none min-h-[300px]">
      <div className="bg-neutral-50 h-16 w-16 rounded-full flex items-center justify-center mb-6">
        <PackageOpen className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="font-poppins font-medium text-[19px] text-[#141414] mb-2">
        No products found
      </h3>
      <p className="font-poppins font-normal text-[14px] text-[#464646] max-w-[320px] leading-relaxed">
        Your product line is currently empty. Add products to display them here.
      </p>
    </div>
  );
}
