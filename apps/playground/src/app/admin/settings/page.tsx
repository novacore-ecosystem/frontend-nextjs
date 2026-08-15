import { Permissions } from "@novacore/frontend-foundation";
import { AdminBreadcrumb, AdminPage, ContentPanel, PageHeader, PermissionBoundary } from "@novacore/frontend-next-shadcn";

export default function SettingsPage() {
  return (
    <PermissionBoundary permission={Permissions.System.Full}>
      <AdminPage>
        <PageHeader
          title="Settings"
          description="System-wide configuration. Requires full system access — switch to the Viewer persona to see the access-denied fallback."
          breadcrumb={<AdminBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Settings" }]} />}
        />
        <ContentPanel>
          <p className="text-sm text-muted-foreground">Demo content only reachable with `system:full`.</p>
        </ContentPanel>
      </AdminPage>
    </PermissionBoundary>
  );
}
