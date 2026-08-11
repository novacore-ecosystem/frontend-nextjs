import Link from "next/link";

const links = [
  { href: "/components", label: "Component showcase", description: "Buttons, badges, cards, dialogs, tabs…" },
  { href: "/theme", label: "Theme customizer", description: "Live preview of mode, base, accent, radius, presets" },
  { href: "/admin/dashboard", label: "Admin dashboard", description: "AdminLayout + AdminSidebar + AdminHeader" },
  { href: "/admin/users", label: "Users (DataTable)", description: "PageHeader + DataTable + ConfirmDialog" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">NovaCore Playground</h1>
        <p className="text-sm text-muted-foreground">
          Manual inspection app for @novacore/frontend-next-shadcn. Not a test suite.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
          >
            <p className="font-medium">{link.label}</p>
            <p className="text-sm text-muted-foreground">{link.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
