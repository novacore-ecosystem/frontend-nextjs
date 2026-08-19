"use client";

import * as React from "react";
import type { UserProfileService } from "./types";

const UserProfileContext = React.createContext<UserProfileService | null>(null);

export interface UserProfileProviderProps {
  children: React.ReactNode;
  /** The consuming application's `UserProfileService` adapter over its real Auth/User API. */
  service: UserProfileService;
}

/**
 * Supplies the `UserProfileService` adapter `UserProfilePage` reads from. Mount once near the
 * app root, alongside `AccessControlProvider`/`PermissionProvider`:
 *
 * ```tsx
 * <UserProfileProvider service={userProfileService}>
 *   <UserProfilePage />
 * </UserProfileProvider>
 * ```
 */
export function UserProfileProvider({ children, service }: UserProfileProviderProps) {
  return <UserProfileContext.Provider value={service}>{children}</UserProfileContext.Provider>;
}

/** Reads the nearest `<UserProfileProvider>`'s service adapter. Throws when none is mounted — `UserProfilePage` cannot render without real data. */
export function useUserProfileService(): UserProfileService {
  const ctx = React.useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("[@novacore/frontend-next-shadcn] UserProfilePage must be rendered inside <UserProfileProvider service={...}>.");
  }
  return ctx;
}
