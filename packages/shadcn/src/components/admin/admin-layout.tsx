"use client";

import { Menu, PanelLeft, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";

interface AdminLayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  /** Desktop icon-only rail mode. The `sidebar` slot must read this itself (e.g. pass it to `<AdminSidebar collapsed>`) — the layout only owns the state and the rail width. */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const AdminLayoutContext = React.createContext<AdminLayoutContextValue | null>(null);

export function useAdminLayout(): AdminLayoutContextValue {
  const ctx = React.useContext(AdminLayoutContext);
  if (!ctx) throw new Error("useAdminLayout must be used within <AdminLayout>");
  return ctx;
}

export interface AdminLayoutProps {
  /** Rendered inside the desktop rail and the mobile drawer. Typically `<AdminSidebar>` — read `sidebarCollapsed` via `useAdminLayout()` to switch it to icon-only mode. */
  sidebar: React.ReactNode;
  /** Rendered as the sticky topbar. Typically `<AdminHeader>`. */
  topbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
  sidebarWidth?: number;
  collapsedWidth?: number;
}

/** Generic admin shell: responsive sidebar rail/drawer + topbar + content. No domain assumptions. */
export function AdminLayout({
  sidebar,
  topbar,
  children,
  className,
  defaultCollapsed = false,
  sidebarWidth = 264,
  collapsedWidth = 68,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(defaultCollapsed);

  const contextValue = React.useMemo<AdminLayoutContextValue>(
    () => ({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }),
    [sidebarOpen, sidebarCollapsed],
  );
  // The `sidebar` node is mounted twice (desktop rail + mobile drawer). Forcing
  // `sidebarCollapsed: false` for the mobile copy keeps icon-only rail mode a
  // desktop-only concept — a full-width mobile sheet has no reason to collapse.
  const mobileContextValue = React.useMemo<AdminLayoutContextValue>(
    () => ({ ...contextValue, sidebarCollapsed: false }),
    [contextValue],
  );

  return (
    <AdminLayoutContext.Provider value={contextValue}>
      <div className={cn("flex min-h-screen bg-background text-foreground", className)}>
        <aside
          className="hidden shrink-0 overflow-hidden border-r border-sidebar-border transition-[width] duration-200 ease-in-out md:block"
          style={{ width: sidebarCollapsed ? collapsedWidth : sidebarWidth }}
        >
          {sidebar}
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AdminLayoutContext.Provider value={mobileContextValue}>{sidebar}</AdminLayoutContext.Provider>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          {topbar}
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
      aria-label="Toggle navigation"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden",
        className,
      )}
    >
      {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}

export function AdminSidebarCollapseToggle({ className }: { className?: string }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useAdminLayout();
  return (
    <button
      type="button"
      aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={sidebarCollapsed}
      onClick={() => setSidebarCollapsed((prev) => !prev)}
      className={cn(
        "hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:inline-flex",
        className,
      )}
    >
      <PanelLeft className="h-4 w-4" />
    </button>
  );
}
