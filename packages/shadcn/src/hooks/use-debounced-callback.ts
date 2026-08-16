"use client";

import { useCallback, useEffect, useRef } from "react";

export interface DebouncedCallback<Args extends unknown[]> {
  (...args: Args): void;
  cancel: () => void;
}

/**
 * Debounces a *function* (as opposed to `useDebouncedValue`, which debounces a value).
 * Always calls the latest `fn`/`delayMs` passed on the most recent render — no stale
 * closures — and cancels its pending timeout on unmount.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs = 300,
): DebouncedCallback<Args> {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const delayRef = useRef(delayMs);
  delayRef.current = delayMs;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => cancel, [cancel]);

  const debounced = useCallback(
    (...args: Args) => {
      cancel();
      timeoutRef.current = setTimeout(() => fnRef.current(...args), delayRef.current);
    },
    [cancel],
  ) as DebouncedCallback<Args>;
  debounced.cancel = cancel;

  return debounced;
}
