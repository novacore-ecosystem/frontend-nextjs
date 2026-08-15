"use client";

import { Permissions } from "@novacore/frontend-foundation";
import * as React from "react";

/** Demo-only personas exercising the permission system — a real app wires `permissions` from its auth session instead. Not a route file, so (unlike layout.tsx/page.tsx) it can export freely. */
export const PERSONAS = {
  admin: { label: "Admin", permissions: [Permissions.Users.View, Permissions.Users.Manage, Permissions.System.Full] },
  viewer: { label: "Viewer", permissions: [Permissions.Users.View] },
} as const;

export type PersonaId = keyof typeof PERSONAS;

interface PersonaContextValue {
  persona: PersonaId;
  setPersona: (id: PersonaId) => void;
}

const PersonaContext = React.createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersona] = React.useState<PersonaId>("admin");
  const value = React.useMemo(() => ({ persona, setPersona }), [persona]);
  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona(): PersonaContextValue {
  const ctx = React.useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within the admin playground layout");
  return ctx;
}
