"use client";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/app/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  isPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      disabled,
      required,
      prefixIcon,
      suffixIcon,
      isPasswordToggle,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordInput = type === "password" || isPasswordToggle;
    const currentType = isPasswordInput
      ? showPassword
        ? "text"
        : "password"
      : type;

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[16px] font-normal leading-normal text-text-label font-poppins select-none"
          >
            {label}
            {required && <span className="text-text-label ml-0.5">*</span>}
          </label>
        )}

        <div
          className={cn(
            "relative flex h-[48px] w-full items-center rounded-input border border-border-input bg-bg-input px-3 transition-colors focus-within:border-border-input-focus focus-within:ring-1 focus-within:ring-border-input-focus",
            hasError && "border-border-input-error focus-within:border-border-input-error focus-within:ring-border-input-error",
            disabled && "cursor-not-allowed opacity-60 bg-neutral-100",
            className
          )}
        >
          {prefixIcon && (
            <span className="mr-2 inline-flex items-center shrink-0 text-neutral-400">
              {prefixIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={currentType}
            disabled={disabled}
            required={required}
            suppressHydrationWarning
            className={cn(
              "h-full w-full bg-transparent text-[16px] font-normal text-text-input placeholder:text-text-placeholder focus:outline-none disabled:cursor-not-allowed font-poppins"
            )}
            {...props}
          />

          {isPasswordInput ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              disabled={disabled}
              className="ml-2 inline-flex items-center shrink-0 text-neutral-400 hover:text-neutral-900 focus:outline-none transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          ) : suffixIcon ? (
            <span className="ml-2 inline-flex items-center shrink-0 text-neutral-400">
              {suffixIcon}
            </span>
          ) : null}
        </div>

        {errorMessage && (
          <p className="text-xs font-normal text-text-error font-poppins">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helperText && (
          <p className="text-xs font-normal text-text-helper font-poppins">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
