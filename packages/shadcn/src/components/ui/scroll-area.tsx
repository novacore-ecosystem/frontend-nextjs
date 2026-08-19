"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";
import { cn } from "../../lib/cn";

export interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
  /** Hides the styled scrollbar track/thumb visually — the viewport still scrolls natively via wheel/trackpad/keyboard, this only omits the custom scrollbar UI. */
  hideScrollbar?: boolean;
}

export function ScrollArea({ children, className, viewportClassName, hideScrollbar }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className={cn("relative overflow-hidden", className)}>
      <ScrollAreaPrimitive.Viewport className={cn("h-full w-full", viewportClassName)}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      {!hideScrollbar ? (
        <>
          <ScrollAreaPrimitive.Scrollbar
            orientation="vertical"
            className="flex touch-none select-none border-l border-l-transparent p-px transition-colors"
          >
            <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
          </ScrollAreaPrimitive.Scrollbar>
          <ScrollAreaPrimitive.Corner />
        </>
      ) : null}
    </ScrollAreaPrimitive.Root>
  );
}
