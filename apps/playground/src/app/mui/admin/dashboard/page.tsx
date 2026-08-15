"use client";

import { AdminPage, Breadcrumb, Button, Card, CardContent, PageHeader, Stat } from "@novacore/frontend-next-mui";
import { useRouter } from "next/navigation";
import { usePersona } from "../persona";

const stats = [
  { label: "Active users", value: "1,204" },
  { label: "Revenue", value: "$48,230" },
  { label: "Open tickets", value: "12" },
];

export default function MuiDashboardPage() {
  const router = useRouter();
  const { setPersona } = usePersona();

  return (
    <AdminPage>
      <PageHeader
        title="Dashboard"
        description="Overview of playground metrics."
        breadcrumb={<Breadcrumb items={[{ label: "Admin", href: "/mui/admin/dashboard" }, { label: "Dashboard" }]} />}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPersona("viewer");
              router.push("/mui/admin/settings");
            }}
          >
            Preview Settings as Viewer
          </Button>
        }
      />
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <Stat label={stat.label} value={stat.value} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
