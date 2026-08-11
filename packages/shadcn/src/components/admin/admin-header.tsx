import * as React from "react";
import { cn } from "../../lib/cn";
import { AdminSidebarToggle } from "./admin-layout";

export function AdminHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur",
        className,
      )}
    >
      <AdminSidebarToggle />
      <div className="flex flex-1 items-center gap-3">{children}</div>
    </header>
  );
}
