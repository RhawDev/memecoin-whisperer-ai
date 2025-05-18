
import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClass = {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-3",
    }[size];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-block rounded-full border-current border-t-transparent animate-spin",
          sizeClass,
          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";
