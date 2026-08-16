"use client";

import { relativeTime, type DateInput } from "@novacore/frontend-foundation";
import { cn } from "../../lib/cn";
import { useRelativeTimeTick } from "../../lib/relative-time-clock";
import { RelativeTime } from "./relative-time";

export interface DataFreshnessProps {
  /** When the displayed data was last fetched/computed. */
  updatedAt: DateInput;
  /** When the next refresh is expected, if the source is on a known cache TTL. */
  nextRefreshAt?: DateInput;
  /** Alternative to `nextRefreshAt` — seconds from `updatedAt` until the cache expires. */
  ttlSeconds?: number;
  /** True while a refetch is in flight — shown as "Refreshing…" instead of the age. */
  isFetching?: boolean;
  /** BCP 47 locale tag forwarded to the relative-time formatting. Pass the app's active locale to keep it reactive to a language switch. */
  locale?: string;
  className?: string;
}

export interface DataFreshnessState {
  label: string;
  isStale: boolean;
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
  locale,
}: Omit<DataFreshnessProps, "className">): DataFreshnessState {
  useRelativeTimeTick(!isFetching);

  if (isFetching) {
    return { label: "Refreshing…", isStale: false };
  }

  const refreshDueAt = resolveRefreshDueAt(updatedAt, nextRefreshAt, ttlSeconds);
  const updatedLabel = `Updated ${relativeTime(updatedAt, { locale })}`;

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
  const { updatedAt, nextRefreshAt, ttlSeconds, isFetching, locale, className } = props;
  const { label } = useDataFreshness(props);

  // The plain "just updated" case (no TTL/cache countdown, not mid-refetch) is the one
  // genuinely fixed-instant timestamp here — render it via `RelativeTime` for the
  // hover/tooltip exact-time affordance. "Refreshing…" and "Cached · refresh in Ns" are
  // status/countdown text, not a point in time, so they stay plain strings.
  if (!isFetching && nextRefreshAt === undefined && ttlSeconds === undefined) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        Updated <RelativeTime date={updatedAt} locale={locale} />
      </span>
    );
  }

  return <span className={cn("text-xs text-muted-foreground", className)}>{label}</span>;
}
