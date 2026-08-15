"use client";

import {
  AdminHeader,
  AdminLayout,
  AdminSidebar,
  AdminSidebarCollapseToggle,
  ApplicationSwitcher,
  CommandPalette,
  useAdminLayout,
  useCommandPalette,
  type ApplicationDefinition,
  type NavigationGroup,
} from "@novacore/frontend-next-shadcn";
import { LayoutDashboard, Search, Users2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const NAV: NavigationGroup[] = [
  {
    id: "overview",
    title: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }],
  },
  {
    id: "system",
    title: "System",
    items: [{ id: "users", label: "Users", href: "/admin/users", icon: <Users2 className="h-4 w-4" /> }],
  },
];

const APPLICATIONS: ApplicationDefinition[] = [
  { id: "admin", name: "Admin Playground", shortName: "Admin", description: "This application", href: "/admin/dashboard", accent: "#2563eb" },
  { id: "oms", name: "Order Management", shortName: "OMS", description: "Orders, fulfillment, returns", href: "#", accent: "#16a34a" },
  { id: "cms", name: "Content Management", shortName: "CMS", description: "Catalog, pages, media", href: "#", accent: "#9333ea" },
];

function PlaygroundSidebar() {
  const { sidebarCollapsed } = useAdminLayout();
  const pathname = usePathname();
  return (
    <AdminSidebar
      groups={NAV}
      activeHref={pathname}
      collapsed={sidebarCollapsed}
      header={<span className="text-sm font-semibold tracking-tight">{sidebarCollapsed ? "NC" : "NovaCore"}</span>}
    />
  );
}

function PlaygroundTopbar() {
  const router = useRouter();
  const { open, setOpen } = useCommandPalette();

  return (
    <>
      <AdminHeader
        applicationSwitcher={<ApplicationSwitcher applications={APPLICATIONS} currentId="admin" onSelect={(app) => router.push(app.href)} />}
        search={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden rounded border border-border bg-muted px-1 font-mono text-[10px] sm:inline">Ctrl K</kbd>
          </button>
        }
      >
        <AdminSidebarCollapseToggle />
      </AdminHeader>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        navigationGroups={NAV}
        onNavigate={(item) => item.href && router.push(item.href)}
        applications={APPLICATIONS}
        onSelectApplication={(app) => router.push(app.href)}
      />
    </>
  );
}

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout sidebar={<PlaygroundSidebar />} topbar={<PlaygroundTopbar />}>
      {children}
    </AdminLayout>
  );
}
