"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-poppins font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-bg-button-primary text-text-button-primary hover:bg-bg-button-primary-hover active:scale-[0.99] transition-all duration-150 shadow-sm",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-[0.99]",
        outline:
          "border border-border-input bg-transparent text-neutral-900 hover:bg-neutral-100",
        ghost:
          "bg-transparent text-neutral-900 hover:bg-neutral-100",
      },
      size: {
        sm: "h-9 px-4 text-xs rounded-input",
        md: "h-[52px] px-8 text-[16px] rounded-button",
        lg: "h-14 px-10 text-lg rounded-button",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: true,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-current" />
        ) : leftIcon ? (
          <span className="mr-2 inline-flex items-center shrink-0">{leftIcon}</span>
        ) : null}

        <span>{children}</span>

        {!isLoading && rightIcon ? (
          <span className="ml-2 inline-flex items-center shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
