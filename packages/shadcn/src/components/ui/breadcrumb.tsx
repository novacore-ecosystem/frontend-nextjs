import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";

export function Breadcrumb({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
  return <nav aria-label="breadcrumb" className={className} {...props} />;
}

export function BreadcrumbList({ className, ...props }: React.ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2", className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: React.ComponentPropsWithoutRef<"li">) {
  return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
}

export function BreadcrumbLink({ asChild, className, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : "a";
  return <Comp className={cn("transition-colors hover:text-foreground", className)} {...props} />;
}

export function BreadcrumbPage({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ children, className, ...props }: React.ComponentPropsWithoutRef<"li">) {
  return (
    <li role="presentation" aria-hidden="true" className={cn("[&>svg]:h-3.5 [&>svg]:w-3.5", className)} {...props}>
      {children ?? <ChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span role="presentation" aria-hidden="true" className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
