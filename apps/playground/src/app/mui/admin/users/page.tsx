import { Permissions } from "@novacore/frontend-foundation";
import {
  AdminPage,
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  Card,
  CardContent,
  ContentPanel,
  Divider,
  PageHeader,
  PermissionButton,
  Text,
  Toolbar,
} from "@novacore/frontend-next-mui";
import * as React from "react";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "invited" | "disabled";
}

const USERS: User[] = Array.from({ length: 8 }).map((_, index) => ({
  id: String(index + 1),
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  status: index % 5 === 0 ? "disabled" : index % 3 === 0 ? "invited" : "active",
}));

const STATUS_TONE: Record<User["status"], "success" | "info" | "default"> = {
  active: "success",
  invited: "info",
  disabled: "default",
};

export default function MuiUsersPage() {
  return (
    <AdminPage>
      <PageHeader
        title="Users"
        description="A permission-gated bulk action — the Viewer persona lacks users:manage, so Manage users disappears."
        breadcrumb={<Breadcrumb items={[{ label: "Admin", href: "/mui/admin/dashboard" }, { label: "Users" }]} />}
        actions={
          <PermissionButton permission={Permissions.Users.Manage} variant="primary" size="sm">
            Manage users
          </PermissionButton>
        }
      />
      <Card>
        <CardContent>
          <Toolbar>
            <Text size="bodySmall" color="muted">
              {USERS.length} users
            </Text>
          </Toolbar>
        </CardContent>
      </Card>
      <ContentPanel sx={{ p: 0 }}>
        {USERS.map((user, index) => (
          <React.Fragment key={user.id}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5 }}>
              <Avatar fallback={user.name.slice(0, 2).toUpperCase()} size="sm" />
              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minWidth: 0 }}>
                <Text size="body" weight="medium">
                  {user.name}
                </Text>
                <Text size="bodySmall" color="muted">
                  {user.email}
                </Text>
              </Box>
              <Badge tone={STATUS_TONE[user.status]}>{user.status}</Badge>
            </Box>
            {index < USERS.length - 1 ? <Divider /> : null}
          </React.Fragment>
        ))}
      </ContentPanel>
    </AdminPage>
  );
}
