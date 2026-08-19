export interface TenantLoginConfiguration {
  /** True when the app already has a tenant public key/client key configured (e.g. via env config) — the login page should not show a tenant selector. */
  configured: boolean;
}

/**
 * Centralizes the "does this deployment already know its tenant?" decision so it isn't
 * reimplemented per app's login page. Each app supplies its own resolved config value (env
 * vars are inherently per-app/per-framework, so this package can't read them itself) — pass
 * `undefined`/empty string when unconfigured.
 */
export function useTenantLoginConfiguration(tenantClientKey: string | undefined): TenantLoginConfiguration {
  return { configured: Boolean(tenantClientKey?.trim()) };
}
