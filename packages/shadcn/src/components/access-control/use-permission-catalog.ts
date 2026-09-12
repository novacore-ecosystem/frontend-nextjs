"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { resolveNormalizedPermissionCatalog, type NormalizedPermissionCatalog } from "./permission-utils";
import type { PermissionDefinition } from "./types";

/**
 * The one place components should resolve a `PermissionDefinition[]` catalog into render-ready
 * data — replaces each component independently calling `resolvePermissionCatalog(permissions, t)`
 * and (for anything needing a single permission by id) re-`flatMap`ping the grouped result
 * itself every render. See `resolveNormalizedPermissionCatalog`'s doc comment for the underlying
 * cross-component caching; this hook adds a `useMemo` on top so the returned object reference
 * itself stays stable across re-renders when `permissions`/the active locale haven't changed —
 * useful as a dependency for the caller's own `useMemo`/`useCallback`.
 */
export function usePermissionCatalog(permissions: PermissionDefinition[]): NormalizedPermissionCatalog {
  const { t } = useTranslation();
  return React.useMemo(() => resolveNormalizedPermissionCatalog(permissions, t), [permissions, t]);
}
