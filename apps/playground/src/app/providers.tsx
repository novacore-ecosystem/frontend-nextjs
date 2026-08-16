"use client";

import { AdminProvider, I18nProvider } from "@novacore/frontend-next-shadcn";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider theme={{ preset: "zinc-blue", mode: "system" }}>
      <I18nProvider>{children}</I18nProvider>
    </AdminProvider>
  );
}
