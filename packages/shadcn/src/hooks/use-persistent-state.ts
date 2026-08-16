"use client";

import { useCallback, useEffect, useState } from "react";

function readStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? defaultValue : (JSON.parse(raw) as T);
  } catch {
    // Malformed JSON, storage disabled, or quota/security error — never let a corrupted
    // or unavailable localStorage entry break the app.
    return defaultValue;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private browsing, quota) — state still works in-memory this session.
  }
}

/**
 * `localStorage`-backed state, namespaced by the caller-supplied `key` (this hook has no
 * opinion on naming scheme — callers own their own namespace, e.g.
 * `novacore.admin.preferences.sidebar`). SSR-safe: the first render (server and client)
 * always uses `defaultValue`, then an effect reads the real persisted value after mount —
 * the same documented flash-of-default tradeoff `AdminProvider`'s theme resolution already
 * accepts, not a new limitation. Returns `[value, setValue, reset]`.
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    setState(readStorage(key, defaultValue));
    // Only re-sync from storage when the key itself changes — re-running on every
    // `defaultValue` identity change would fight `setPersistedState`'s own writes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setPersistedState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        writeStorage(key, next);
        return next;
      });
    },
    [key],
  );

  const reset = useCallback(() => {
    setState(defaultValue);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [state, setPersistedState, reset];
}
