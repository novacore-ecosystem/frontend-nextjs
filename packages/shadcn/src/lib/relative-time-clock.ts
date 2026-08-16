"use client";

import { useEffect, useReducer } from "react";

type Listener = () => void;

const TICK_MS = 30_000;
const listeners = new Set<Listener>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function ensureInterval(): void {
  if (intervalId !== null || typeof window === "undefined") return;
  intervalId = setInterval(() => {
    listeners.forEach((listener) => listener());
  }, TICK_MS);
}

function releaseIntervalIfIdle(): void {
  if (listeners.size === 0 && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * One `setInterval` shared by every mounted relative-time display, instead of each
 * instance owning its own timer — a `DataTable` full of `RelativeTime` cells would
 * otherwise mean hundreds of independent intervals. Starts lazily on the first
 * subscriber and stops itself when the last one unmounts.
 */
function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  ensureInterval();
  return () => {
    listeners.delete(listener);
    releaseIntervalIfIdle();
  };
}

/** Re-renders the calling component on the shared tick above, while `enabled` is true. */
export function useRelativeTimeTick(enabled: boolean): void {
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    if (!enabled) return undefined;
    return subscribe(forceUpdate);
  }, [enabled]);
}
