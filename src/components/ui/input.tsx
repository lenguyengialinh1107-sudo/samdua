import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-10 w-full rounded-sm border border-border-strong bg-surface px-3 text-sm text-foreground",
        "placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-surface-muted",
        "aria-[invalid=true]:border-danger",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-surface-muted",
        "aria-[invalid=true]:border-danger",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-sm border border-border-strong bg-surface px-3 pr-8 text-sm text-foreground",
        "disabled:cursor-not-allowed disabled:bg-surface-muted",
        "aria-[invalid=true]:border-danger",
        className,
      )}
      {...props}
    />
  );
});
Select.displayName = "Select";
