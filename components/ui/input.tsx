import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-xl border border-accent/30 bg-transparent px-4 py-2 text-base text-foreground",
        "placeholder:text-foreground/40 outline-none transition-[color,box-shadow]",
        "focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/30",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
