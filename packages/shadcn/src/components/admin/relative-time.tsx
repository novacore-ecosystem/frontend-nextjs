"use client";

import * as React from "react";
import { formatDateTime, parseDateInput, relativeTime, type DateInput } from "@novacore/frontend-foundation";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { useRelativeTimeTick } from "../../lib/relative-time-clock";
import { Tooltip } from "../ui/tooltip";

export type RelativeTimeMode = "relative" | "absolute";

export interface RelativeTimeProps {
  /** The instant to display. `null`/`undefined`/an unparseable value render `fallback` instead. */
  date: DateInput | null | undefined;
  /** Which representation leads; the other is revealed in a tooltip on hover/focus. Defaults to `"relative"`. */
  mode?: RelativeTimeMode;
  /** BCP 47 locale tag forwarded to `Intl`. Omit to auto-follow the nearest `<I18nProvider>`'s active locale (reactive to `LocaleSwitcher`/`setLocale`) — pass this only to pin a specific locale regardless of the app's language switcher. */
  locale?: string;
  /** Reveals the alternate representation in a tooltip on hover/focus. Defaults to `true`. */
  showTooltip?: boolean;
  /** `"auto"` (default) keeps the label live via a single app-wide shared tick (see `useRelativeTimeTick`); `false` renders once and never updates on its own. */
  updateInterval?: "auto" | false;
  /** Rendered when `date` is missing or invalid, instead of throwing. Defaults to `"—"`. */
  fallback?: React.ReactNode;
  className?: string;
}

function tryParse(date: DateInput | null | undefined): Date | null {
  if (date === null || date === undefined) return null;
  try {
    return parseDateInput(date);
  } catch {
    return null;
  }
}

/**
 * Displays a timestamp as relative ("2 hours ago") or absolute ("Aug 16, 2026, 3:32 PM")
 * text, with the other representation available in a tooltip on hover/focus — reusing the
 * shared `Tooltip` rather than swapping the visible text, so a table column never jitters
 * width on hover. Always wrapped in a semantic `<time dateTime>` and carries the full
 * relative + absolute label via `aria-label`, so the exact instant is never hover-only.
 *
 * SSR-safe: the first render (server, and the client's pre-hydration pass) always shows
 * the absolute form, since it's the one value that can't drift between server "now" and
 * client "now" — the relative form only takes over post-mount, avoiding a hydration
 * mismatch on a "2 minutes ago" that could read differently on the client a moment later.
 */
export function RelativeTime({
  date,
  mode = "relative",
  locale,
  showTooltip = true,
  updateInterval = "auto",
  fallback = "—",
  className,
}: RelativeTimeProps) {
  const { locale: contextLocale } = useTranslation();
  const effectiveLocale = locale ?? contextLocale;
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  useRelativeTimeTick(mounted && updateInterval === "auto");

  const parsed = tryParse(date);
  if (!parsed) {
    return <span className={className}>{fallback}</span>;
  }

  const isoInstant = parsed.toISOString();
  const absoluteText = formatDateTime(parsed, { locale: effectiveLocale });
  const relativeText = mounted ? relativeTime(parsed, { locale: effectiveLocale }) : absoluteText;
  const primaryText = mode === "relative" ? relativeText : absoluteText;
  const alternateText = mode === "relative" ? absoluteText : relativeText;

  const timeEl = (
    <time
      dateTime={isoInstant}
      aria-label={`${relativeText}, ${absoluteText}`}
      tabIndex={showTooltip ? 0 : undefined}
      className={cn(
        "cursor-default underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 transition-colors",
        "hover:decoration-foreground focus-visible:decoration-foreground focus-visible:outline-none",
        "motion-reduce:transition-none",
        className,
      )}
    >
      {primaryText}
    </time>
  );

  return showTooltip ? <Tooltip content={alternateText}>{timeEl}</Tooltip> : timeEl;
}
