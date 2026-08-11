import * as React from "react";
import { cn } from "../../lib/cn";

export function AdminSidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  return <nav className={cn("flex h-full flex-col gap-1 overflow-y-auto p-4", className)}>{children}</nav>;
}

export function AdminSidebarSection({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {title ? <p className="mb-1 px-2 text-xs font-semibold uppercase text-muted-foreground">{title}</p> : null}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export interface AdminSidebarItemProps {
  icon?: React.ReactNode;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function AdminSidebarItem({ icon, active, className, children, ...props }: AdminSidebarItemProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent font-medium text-accent-foreground",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </div>
  );
}
