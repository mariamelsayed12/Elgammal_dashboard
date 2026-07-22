"use client";

import { useRouter } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import toast from "react-hot-toast";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const router = useRouter();

 const handleLogout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (res.ok) {
    toast.success("Logged out successfully");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }
 }

  return (
    <header className="bg-white border-b border-neutral-100 flex h-[71px] items-center justify-between pr-[32px] w-full shrink-0 select-none z-10">
      <div className="flex gap-[32px] items-center h-full">
        {/* Brand Logo Panel */}
        <div className="bg-[#131827] flex flex-col h-full items-center justify-center px-[32px] w-[239.99px] shrink-0">
          <span className="font-poppins font-bold text-[20px] text-white tracking-[2.5px] uppercase leading-none">
            ALGAMMAL
          </span>
          <span className="font-poppins font-normal text-[10px] text-white/70 tracking-[2.5px] uppercase mt-1 leading-none">
            — INC. —
          </span>
        </div>

        {/* Page Title */}
        <h1 className="font-poppins font-semibold text-[23px] text-neutral-950 leading-none">
          {title}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[16px] items-center">
        {/* Add Product Button (Design-Only / Disabled) */}
        <button
          disabled
          className="bg-neutral-900 hover:bg-neutral-800 text-[#eff1f4] flex gap-[8px] h-[36px] items-center justify-center px-[24px] py-[8px] rounded-[16px] shrink-0 font-poppins font-medium text-[16px] transition-colors cursor-not-allowed opacity-60"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="border border-[#d4d5d8] hover:bg-neutral-50 text-neutral-950 flex gap-[8px] h-[36px] items-center justify-center px-[24px] py-[8px] rounded-[16px] shrink-0 font-poppins font-medium text-[16px] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
