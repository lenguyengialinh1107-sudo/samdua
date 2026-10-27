"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "rounded-sm border border-border-strong bg-surface text-foreground shadow-lg",
          description: "text-muted",
          actionButton: "bg-accent text-accent-foreground",
          cancelButton: "bg-surface-muted text-foreground",
        },
      }}
    />
  );
}
