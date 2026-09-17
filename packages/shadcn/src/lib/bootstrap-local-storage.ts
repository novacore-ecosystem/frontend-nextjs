import type { BootstrapStorage, VersionedBootstrap } from "@novacore/frontend-foundation";

/**
 * `localStorage`-backed `BootstrapStorage` (`@novacore/frontend-foundation`) — the default
 * concrete implementation for a browser-based Next.js app. Frontend-foundation ships no default
 * (same "you supply it" precedent as `TokenProvider`); this is that supplied implementation.
 *
 * SSR-safe (no-ops outside a browser) and tolerant of storage failures (private-mode/quota
 * errors just mean Bootstrap isn't cached this session, not a thrown error).
 */
export function createLocalStorageBootstrapStorage<T extends VersionedBootstrap>(
  storageKey = "novacore.bootstrap",
): BootstrapStorage<T> {
  return {
    get() {
      if (typeof window === "undefined") return null;
      try {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    set(bootstrap) {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(bootstrap));
      } catch {
        // Quota exceeded / private-mode storage rejection - Bootstrap just won't be cached.
      }
    },
    clear() {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Same as set() - non-fatal.
      }
    },
  };
}
