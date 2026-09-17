/**
 * A small, non-`httpOnly` cookie carrying only the locally-cached Bootstrap's version number —
 * never the payload itself. Exists so a Next.js server (middleware or a server component) can
 * tell "does this browser already have a Bootstrap cached" without seeing `localStorage` (which
 * SSR/middleware can't access), and decide whether to fetch Bootstrap server-side accordingly —
 * see `shouldFetchBootstrapOnServer` (`./bootstrap-ssr`).
 */
export const BOOTSTRAP_VERSION_COOKIE_NAME = "bootstrap_v";

/** Parses the marker cookie's raw string value; `null` for absent/invalid, same as "no local cache". */
export function parseBootstrapVersionCookie(value: string | undefined | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Writes/refreshes the marker cookie. Call this every time a Bootstrap is persisted locally —
 * wire it to `BootstrapRefreshCoordinator.onRefreshed` (`@novacore/frontend-foundation`) once, at
 * app init, rather than calling it ad hoc. A long TTL is fine (Bootstrap changes extremely
 * rarely; this cookie is refreshed on every actual persist anyway) — defaults to 30 days.
 * No-ops outside a browser, so it's safe to import into server-rendered code paths.
 */
export function writeBootstrapVersionCookie(version: number, maxAgeSeconds = 60 * 60 * 24 * 30): void {
  if (typeof document === "undefined") return;
  document.cookie = `${BOOTSTRAP_VERSION_COOKIE_NAME}=${version}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

/** Clears the marker cookie — call alongside `BootstrapStorage.clear()` (e.g. on logout, if the app chooses to drop the cached Bootstrap then). */
export function clearBootstrapVersionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${BOOTSTRAP_VERSION_COOKIE_NAME}=; path=/; max-age=0`;
}
