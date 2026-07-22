"use client";

import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export default function LoginPage() {
  return (
    <main className="relative h-screen w-full flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
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
            onSubmit={(e) => e.preventDefault()}
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
            <Button variant="primary" size="md" fullWidth type="submit">
              Login
            </Button>
          </form>

        </div>
      </div>
    </main>
  );
}
