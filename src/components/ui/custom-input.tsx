import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative group">
          <input
            className={cn(
              "w-full px-4 py-2 bg-white rounded-md outline-none transition-all duration-300",
              "border-0", // Remove default border
              "ring-1 ring-[#995D33]", // Use ring instead of border for precise control
              "focus:ring-2 focus:ring-[#995D33]", // Thicker ring on focus
              "hover:ring-opacity-80", // Subtle hover effect
              "placeholder:text-gray-400",
              "animate-in fade-in-50 duration-300", // Subtle fade-in animation
              className
            )}
            ref={ref}
            {...props}
          />
          {/* Animated underline effect */}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#995D33] group-focus-within:w-full transition-all duration-300 ease-out"></div>
        </div>
        {error && <p className="text-sm text-red-500 animate-fade-in">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput };
