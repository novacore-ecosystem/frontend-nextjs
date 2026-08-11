"use client";

import { ThemeCustomizer } from "@novacore/frontend-next-shadcn";

export default function ThemePage() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Theme customizer</h1>
        <p className="text-sm text-muted-foreground">Live preview — changes apply immediately via CSS variables.</p>
      </div>
      <ThemeCustomizer />
    </main>
  );
}
