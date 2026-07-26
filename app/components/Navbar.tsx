"use client";

import { useRouter } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import toast from "react-hot-toast";
import { useState } from "react";
import { CreateProductDrawer } from "./CreateProductDrawer";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    setIsloading(true);
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      toast.success("Logged out successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
    setIsloading(false);
  };

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
        {/* Add Product Button */}
        <Button
          onClick={() => setIsDrawerOpen(true)}
          fullWidth={false}
          size="sm"
          leftIcon={<Plus className="h-5 w-5" />}
          className="rounded-xl text-white h-[36px] px-[24px]  font-poppins font-medium text-[16px] transition-all flex items-center justify-center shrink-0 border-0"
        >
          Add Product
        </Button>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          isLoading={isLoading}
          variant="outline"
          size="sm"
          fullWidth={false}
          leftIcon={<LogOut className="h-4 w-4" />}
          className="border border-[#d4d5d8] hover:bg-neutral-50 text-neutral-950 h-[36px] px-[24px] rounded-[16px] font-poppins font-medium text-[16px] transition-colors"
        >
          Logout
        </Button>
      </div>

      {/* Create Product Drawer */}
      <CreateProductDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}
