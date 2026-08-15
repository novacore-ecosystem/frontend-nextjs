import { Permissions } from "@novacore/frontend-foundation";
import { AdminPage, Breadcrumb, ContentPanel, PageHeader, PermissionBoundary, Text } from "@novacore/frontend-next-mui";

export default function MuiSettingsPage() {
  return (
    <PermissionBoundary permission={Permissions.System.Full}>
      <AdminPage>
        <PageHeader
          title="Settings"
          description="System-wide configuration. Requires full system access — switch to the Viewer persona to see the access-denied fallback."
          breadcrumb={<Breadcrumb items={[{ label: "Admin", href: "/mui/admin/dashboard" }, { label: "Settings" }]} />}
        />
        <ContentPanel>
          <Text size="bodySmall" color="muted">
            Demo content only reachable with `system:full`.
          </Text>
        </ContentPanel>
      </AdminPage>
    </PermissionBoundary>
  );
}
