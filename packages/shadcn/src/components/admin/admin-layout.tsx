"use client";

import { Menu, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";

interface AdminLayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminLayoutContext = React.createContext<AdminLayoutContextValue | null>(null);

export function useAdminLayout(): AdminLayoutContextValue {
  const ctx = React.useContext(AdminLayoutContext);
  if (!ctx) throw new Error("useAdminLayout must be used within <AdminLayout>");
  return ctx;
}

export interface AdminLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Generic admin shell: responsive sidebar + header + content. No domain assumptions. */
export function AdminLayout({ sidebar, header, children, className }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <AdminLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className={cn("flex min-h-screen bg-background text-foreground", className)}>
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-card transition-transform md:static md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebar}
        </aside>

        {sidebarOpen ? (
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}

export function AdminSidebarToggle({ className }: { className?: string }) {
  const { sidebarOpen, setSidebarOpen } = useAdminLayout();
  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent md:hidden", className)}
    >
      {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
