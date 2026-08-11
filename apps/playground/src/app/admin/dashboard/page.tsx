import {
  AdminPage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@novacore/frontend-next-shadcn";

const stats = [
  { label: "Active users", value: "1,204" },
  { label: "Revenue", value: "$48,230" },
  { label: "Open tickets", value: "12" },
];

export default function DashboardPage() {
  return (
    <AdminPage>
      <PageHeader title="Dashboard" description="Overview of playground metrics." />
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
