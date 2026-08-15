"use client";

import { Permissions } from "@novacore/frontend-foundation";
import {
  AdminHeader,
  AdminLayout,
  AdminSidebar,
  AdminSidebarCollapseToggle,
  ApplicationSwitcher,
  Box,
  Button,
  CommandPalette,
  PermissionProvider,
  Text,
  useAdminLayout,
  useCommandPalette,
  type AdminNavigationGroup,
  type ApplicationDefinition,
} from "@novacore/frontend-next-mui";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { PERSONAS, PersonaProvider, type PersonaId, usePersona } from "./persona";

const NAV: AdminNavigationGroup[] = [
  {
    id: "overview",
    title: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", href: "/mui/admin/dashboard", icon: <DashboardIcon fontSize="small" /> }],
  },
  {
    id: "system",
    title: "System",
    items: [
      { id: "users", label: "Users", href: "/mui/admin/users", icon: <PeopleIcon fontSize="small" />, permission: Permissions.Users.View },
      { id: "settings", label: "Settings", href: "/mui/admin/settings", icon: <SettingsIcon fontSize="small" />, permission: Permissions.System.Full },
    ],
  },
];

const APPLICATIONS: ApplicationDefinition[] = [
  { id: "admin", name: "Admin Playground", shortName: "Admin", description: "This application", href: "/mui/admin/dashboard", accent: "#4f46e5" },
  { id: "oms", name: "Order Management", shortName: "OMS", description: "Orders, fulfillment, returns", href: "#", accent: "#059669" },
  { id: "cms", name: "Content Management", shortName: "CMS", description: "Catalog, pages, media", href: "#", accent: "#7c3aed" },
];

function PersonaSwitcher() {
  const { persona, setPersona } = usePersona();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, border: "1px solid", borderColor: "divider", borderRadius: 1.5, p: 0.5 }}>
      {(Object.keys(PERSONAS) as PersonaId[]).map((id) => (
        <Button
          key={id}
          size="sm"
          variant={persona === id ? "primary" : "ghost"}
          onClick={() => setPersona(id)}
          sx={{ minWidth: 0, px: 1.25, py: 0.25, fontSize: 12 }}
        >
          {PERSONAS[id].label}
        </Button>
      ))}
    </Box>
  );
}

function PlaygroundSidebar() {
  const { sidebarCollapsed } = useAdminLayout();
  const pathname = usePathname();
  return (
    <AdminSidebar
      groups={NAV}
      activeHref={pathname}
      collapsed={sidebarCollapsed}
      header={
        <Text size="body" weight="bold">
          {sidebarCollapsed ? "NC" : "NovaCore"}
        </Text>
      }
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
          <Box
            as="button"
            onClick={() => setOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              bgcolor: "background.default",
              color: "text.secondary",
              px: 1.25,
              py: 0.75,
              fontSize: 12,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <SearchIcon sx={{ fontSize: 15 }} />
            <span>Search…</span>
          </Box>
        }
        actions={<PersonaSwitcher />}
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

function PermissionedShell({ children }: { children: React.ReactNode }) {
  const { persona } = usePersona();
  return (
    <PermissionProvider permissions={PERSONAS[persona].permissions}>
      <AdminLayout sidebar={<PlaygroundSidebar />} topbar={<PlaygroundTopbar />}>
        {children}
      </AdminLayout>
    </PermissionProvider>
  );
}

export default function MuiAdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
      <PermissionedShell>{children}</PermissionedShell>
    </PersonaProvider>
  );
}
