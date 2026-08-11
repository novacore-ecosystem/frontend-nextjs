import {
  AdminHeader,
  AdminLayout,
  AdminSidebar,
  AdminSidebarItem,
  AdminSidebarSection,
} from "@novacore/frontend-next-shadcn";
import Link from "next/link";

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout
      sidebar={
        <AdminSidebar>
          <AdminSidebarSection title="Playground">
            <Link href="/admin/dashboard">
              <AdminSidebarItem>Dashboard</AdminSidebarItem>
            </Link>
            <Link href="/admin/users">
              <AdminSidebarItem>Users</AdminSidebarItem>
            </Link>
          </AdminSidebarSection>
        </AdminSidebar>
      }
      header={<AdminHeader>Admin Playground</AdminHeader>}
    >
      {children}
    </AdminLayout>
  );
}
