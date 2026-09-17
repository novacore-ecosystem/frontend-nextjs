export interface BootstrapSsrDecisionInput {
  /** From `InitialAuthState.hasAccessToken || hasRefreshToken` being both false (`./initial-auth-state`) — a true guest, not merely "needs refresh". */
  isGuest: boolean;
  /** Parsed via `parseBootstrapVersionCookie` (`./bootstrap-marker-cookie`) — `null` means no local Bootstrap cache exists yet. */
  cachedBootstrapVersion: number | null;
}

/**
 * Decides whether the Bootstrap API must be called during server-side rendering, so the initial
 * HTML is correct on first paint without an extra client-side round trip:
 *
 * - **Guest** (no auth cookies at all): always `true` — there is no reliable client-side way for
 *   a guest to know a cached Bootstrap (if any) is still current, so every guest render validates.
 * - **Authenticated, cache miss** (no `bootstrap_v` marker cookie): `true` — first visit / cleared
 *   storage, the same "must fetch before first paint" case as a guest.
 * - **Authenticated, cache hit**: `false` — do not call the Bootstrap API just because the page
 *   was refreshed. The existing local copy renders immediately; `BootstrapHub` (SignalR) and the
 *   login/refresh response's `version` field are what catch a change from here on.
 */
export function shouldFetchBootstrapOnServer(input: BootstrapSsrDecisionInput): boolean {
  return input.isGuest || input.cachedBootstrapVersion === null;
}
