"use client";

import { AdminProvider } from "@novacore/frontend-next-shadcn";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider theme={{ preset: "zinc-blue", mode: "system" }}>
      {children}
    </AdminProvider>
  );
}
