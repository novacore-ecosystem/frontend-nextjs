"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn } from "../../lib/cn";

export interface AvatarProps extends React.ComponentPropsWithoutRef<"span"> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {src ? <AvatarPrimitive.Image src={src} alt={alt} className="aspect-square h-full w-full object-cover" /> : null}
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  ),
);
Avatar.displayName = "Avatar";
