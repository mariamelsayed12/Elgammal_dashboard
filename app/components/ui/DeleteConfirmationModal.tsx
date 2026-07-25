"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { cn } from "@/app/lib/utils";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  closeOnOutsideClick?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure you want to delete\nthis product  ?",
  description = "This action can’t be undone.",
  confirmText = "Yes, delete",
  cancelText = "Cancel",
  isLoading = false,
  closeOnOutsideClick = true,
}: DeleteConfirmationModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [animate, setAnimate] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      // Small timeout to allow mounting before triggering transition
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 10);
      document.body.style.overflow = "hidden";
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Trap keyboard focus and handle Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute("disabled")
        ) as HTMLElement[];

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on Cancel button for safety
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const cancelButton = modalRef.current.querySelector('button[data-name="cancel-btn"]') as HTMLButtonElement;
        if (cancelButton) {
          cancelButton.focus();
        } else {
          const firstButton = modalRef.current.querySelector('button') as HTMLButtonElement;
          if (firstButton) firstButton.focus();
        }
      }
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out",
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={handleOutsideClick}
    >
      {/* Dark overlay with background blur */}
      <div
        className={cn(
          "absolute inset-0 bg-bg-overlay/40 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out",
          animate ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        data-name="delete-modal-card"
        className={cn(
          "relative w-full max-w-[470px] bg-[#f4f1ef] rounded-[12px] shadow-card border border-[#d4d5d8] overflow-hidden flex flex-col gap-[32px] p-[24px] transition-all duration-300 ease-in-out transform",
          animate ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        {/* Texts container */}
        <div className="flex flex-col gap-[24px] items-start w-full">
          {/* Title */}
          <h2
            id="modal-title"
            className="font-poppins font-medium text-[19px] leading-[normal] text-[#141414] whitespace-pre-line"
          >
            {title}
          </h2>
          {/* Description */}
          <p
            id="modal-description"
            className="font-poppins font-normal text-[16px] leading-[normal] text-[#464646]"
          >
            {description}
          </p>
        </div>

        {/* Buttons container */}
        <div className="flex gap-[24px] items-center justify-end w-full">
          {/* Cancel Button */}
          <Button
            variant="ghost"
            data-name="cancel-btn"
            onClick={onClose}
            disabled={isLoading}
            fullWidth={false}
            className="h-[36px] px-[8px] text-[16px] font-poppins font-medium text-[#141414] hover:bg-neutral-400/10 active:scale-[0.98] transition-all rounded-[16px] shrink-0"
          >
            {cancelText}
          </Button>

          {/* Delete Button */}
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            fullWidth={false}
            className="bg-[#d7110e] hover:bg-red-700 text-white text-[16px] font-poppins font-medium h-[36px] px-[24px] py-[8px] rounded-[16px] shrink-0 transition-all duration-150"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
