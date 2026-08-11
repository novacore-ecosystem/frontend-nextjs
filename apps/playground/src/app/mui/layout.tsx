"use client";

import { ClientProvider, ToastProvider } from "@novacore/frontend-next-mui";

export default function MuiSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider theme={{ preset: "indigo", mode: "system" }}>
      <ToastProvider>{children}</ToastProvider>
    </ClientProvider>
  );
}
