"use client";

import {
  AdminHeader,
  AdminLayout,
  AdminSidebar,
  AdminSidebarCollapseToggle,
  useAdminLayout,
  type NavigationGroup,
} from "@novacore/frontend-next-shadcn";
import { LayoutDashboard, Users2 } from "lucide-react";
import { usePathname } from "next/navigation";

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

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout
      sidebar={<PlaygroundSidebar />}
      topbar={
        <AdminHeader>
          <AdminSidebarCollapseToggle />
          <span className="text-sm font-medium">Admin Playground</span>
        </AdminHeader>
      }
    >
      {children}
    </AdminLayout>
  );
}
