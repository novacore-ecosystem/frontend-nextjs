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
      {/*
       * Always mounted, even when `hideScrollbar` — Radix only sets the Viewport's real
       * `overflow-y` to `scroll` once a `Scrollbar` of that orientation has mounted (see its
       * `onScrollbarYEnabledChange` effect); skipping this element entirely leaves the Viewport's
       * `overflow-y: hidden`, which disables actual scrolling, not just the visual scrollbar.
       * `hideScrollbar` therefore only zeroes this element out visually (it's absolutely
       * positioned by Radix internally, so this never affects Viewport's layout/width).
       */}
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className={cn(
          "flex touch-none select-none border-l border-l-transparent p-px transition-colors",
          hideScrollbar && "w-0 border-none p-0 opacity-0",
        )}
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.Scrollbar>
      {!hideScrollbar ? <ScrollAreaPrimitive.Corner /> : null}
    </ScrollAreaPrimitive.Root>
  );
}
