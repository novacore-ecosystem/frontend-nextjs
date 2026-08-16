"use client";

import * as React from "react";
import { relativeTime, type DateInput } from "@novacore/frontend-foundation";
import { cn } from "../../lib/cn";

const TICK_INTERVAL_MS = 30_000;

export interface DataFreshnessProps {
  /** When the displayed data was last fetched/computed. */
  updatedAt: DateInput;
  /** When the next refresh is expected, if the source is on a known cache TTL. */
  nextRefreshAt?: DateInput;
  /** Alternative to `nextRefreshAt` — seconds from `updatedAt` until the cache expires. */
  ttlSeconds?: number;
  /** True while a refetch is in flight — shown as "Refreshing…" instead of the age. */
  isFetching?: boolean;
  className?: string;
}

export interface DataFreshnessState {
  label: string;
  isStale: boolean;
}

/** Re-renders on a fixed interval so relative-time labels stay live without new data arriving. */
function useClockTick(intervalMs: number): number {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

function resolveRefreshDueAt(updatedAt: DateInput, nextRefreshAt?: DateInput, ttlSeconds?: number): Date | null {
  if (nextRefreshAt !== undefined) return new Date(nextRefreshAt);
  if (ttlSeconds !== undefined) return new Date(new Date(updatedAt).getTime() + ttlSeconds * 1000);
  return null;
}

/**
 * Computes a freshness label ("Updated 2m ago" / "Cached · refresh in 42s"). Deliberately
 * takes only a point-in-time + optional TTL, not a live subscription — callers wire it to
 * whatever real freshness signal they have (e.g. TanStack Query's `dataUpdatedAt`/
 * `isFetching` today; a backend `refreshedAt`/`cacheTtl` contract later) without this
 * component needing to change.
 */
export function useDataFreshness({
  updatedAt,
  nextRefreshAt,
  ttlSeconds,
  isFetching,
}: Omit<DataFreshnessProps, "className">): DataFreshnessState {
  useClockTick(TICK_INTERVAL_MS);

  if (isFetching) {
    return { label: "Refreshing…", isStale: false };
  }

  const refreshDueAt = resolveRefreshDueAt(updatedAt, nextRefreshAt, ttlSeconds);
  const updatedLabel = `Updated ${relativeTime(updatedAt)}`;

  if (!refreshDueAt) {
    return { label: updatedLabel, isStale: false };
  }

  const remainingMs = refreshDueAt.getTime() - Date.now();
  if (remainingMs <= 0) {
    return { label: `${updatedLabel} · refresh available`, isStale: true };
  }

  const remainingSeconds = Math.round(remainingMs / 1000);
  const refreshInLabel = remainingSeconds < 60 ? `${remainingSeconds}s` : `${Math.round(remainingSeconds / 60)}m`;
  return { label: `Cached · refresh in ${refreshInLabel}`, isStale: false };
}

/** Small, muted freshness indicator — pairs with `StatCard` or stands alone next to any cached summary. */
export function DataFreshness(props: DataFreshnessProps) {
  const { label } = useDataFreshness(props);
  return <span className={cn("text-xs text-muted-foreground", props.className)}>{label}</span>;
}
