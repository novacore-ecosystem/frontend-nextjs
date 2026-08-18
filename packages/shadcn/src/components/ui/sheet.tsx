"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";

export interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sheet({ children, open, defaultOpen, onOpenChange }: SheetProps) {
  return (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export type SheetSide = "left" | "right" | "top" | "bottom";

const SIDE_CLASSES: Record<SheetSide, string> = {
  left: "inset-y-0 left-0 h-full w-72 border-r data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left",
  right:
    "inset-y-0 right-0 h-full w-80 border-l data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
  top: "inset-x-0 top-0 border-b data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top",
  bottom:
    "inset-x-0 bottom-0 border-t data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
};

/**
 * `"default"` keeps the historical `w-80` from `SIDE_CLASSES` (callers may still override via
 * `className`, e.g. the old `max-w-md` pattern). `"wide"` is for a real workspace — content-heavy
 * panels like Role/Position authorization editing — sized responsively rather than a single fixed
 * pixel width: full width on mobile, ~85vw on tablet, ~65vw capped at 64rem (`max-w-5xl`) on
 * desktop, so it scales with the viewport instead of feeling cramped on a laptop or wasted on an
 * ultrawide monitor.
 */
export type SheetContentSize = "default" | "wide";

const SIZE_CLASSES: Record<SheetContentSize, string> = {
  default: "",
  wide: "w-full sm:w-[85vw] lg:w-[65vw] lg:max-w-5xl",
};

export interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
  side?: SheetSide;
  showCloseButton?: boolean;
  size?: SheetContentSize;
}

export function SheetContent({
  children,
  className,
  side = "right",
  showCloseButton = true,
  size = "default",
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col gap-4 border-border bg-card p-0 shadow-lg outline-none",
          SIDE_CLASSES[side],
          SIZE_CLASSES[size],
          className,
        )}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 border-b border-border p-4", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex items-center gap-2 border-t border-border p-4", className)} {...props} />;
}

export const SheetTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
  ),
);
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  ),
);
SheetDescription.displayName = "SheetDescription";
