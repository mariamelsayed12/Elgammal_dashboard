"use client";

import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useForm } from "react-hook-form";
import z from "zod";
import { loginformSchema } from "../schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

type LoginFormValues = z.infer<typeof loginformSchema>;


export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginformSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (res.ok) {
      toast.success("Login successfully");

      setTimeout(() => {
        router.push("/");
      }, 2000);

      return;
    }

    if (res.status === 401) {
      toast.error("Email or password is incorrect");
      return;
    }

    if (res.status === 500) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.error("Failed to login.");
  } catch (error) {
    toast.error("Network error. Please check your internet connection.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="relative h-screen w-full flex items-center justify-center  p-4 sm:p-6 lg:p-8">
      {/* Background Image with Dark Overlay */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/login-bg.png"
          alt="Login Background"
          fill
          priority
          className="object-cover size-full"
        />
        <div className="absolute inset-0 bg-bg-overlay" />
      </div>

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-[684px] h-full max-h-[656px] bg-bg-card rounded-card shadow-card overflow-hidden flex flex-col items-center justify-center px-6 py-8 sm:px-12 sm:py-12">
        {/* Inner Card Content */}
        <div className="w-full max-w-[380px] flex flex-col items-center gap-[56px]">
          
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center gap-[24px] w-full text-center">
            {/* Logo */}
            <div className="w-[56px] h-[56px] flex items-center justify-center overflow-hidden shrink-0">
              <div className="w-[56px] h-[38px] relative">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={56}
                  height={38}
                  priority
                  className="w-full h-full block"
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col items-center justify-center gap-[16px] w-full">
              <h1 className="font-poppins font-medium text-[23px] leading-normal text-text-title">
                Welcome back
              </h1>
              <p className="font-poppins font-normal text-[16px] leading-normal text-text-subtitle">
                Login to manage your CMS
              </p>
            </div>
          </div>

          {/* Form UI (Only Reusable Input and Button Components) */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-[32px] w-full"
          >
            {/* Inputs Container */}
            <div className="flex flex-col items-start justify-center gap-[16px] w-full">
              {/* Email Input */}
              <Input
                label="Email"
                type="email"
                required
                placeholder=""
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />

              {/* Password Input & Forgot Password */}
              <div className="flex flex-col items-end justify-center w-full">
                <Input
                  label="Password"
                  type="password"
                  required
                  isPasswordToggle
                  placeholder=""
                  autoComplete="current-password"
                  {...register("password")}
                  error={errors.password?.message}
                />
                
                {/* Forgot Password Link */}
                <div className="flex h-[32px] items-center justify-end w-full mt-1">
                  <a
                    href="#forgot-password"
                    className="font-poppins font-normal text-[14px] text-text-link hover:underline transition-all"
                  >
                    Forgot password ?
                  </a>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <Button variant="primary" size="md" fullWidth type="submit" isLoading={loading}>
              Login
            </Button>
          </form>

        </div>
      </div>
    </main>
  );
}

