import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/cn";
import { DataFreshness, type DataFreshnessProps } from "./data-freshness";

export type StatCardTone = "neutral" | "success" | "warning" | "destructive" | "info" | "brand";

const TONE_ICON_CLASSES: Record<StatCardTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  brand: "bg-primary/10 text-primary",
};

export interface StatCardTrend {
  value: number;
  direction: "up" | "down";
}

export interface StatCardProps {
  label: string;
  value: string | number;
  /** Rendered inside a tone-tinted circular chip — pass a lucide icon element. */
  icon?: React.ReactNode;
  tone?: StatCardTone;
  trend?: StatCardTrend;
  /** Wire this to a real freshness signal (e.g. a query's `dataUpdatedAt`/`isFetching`) whenever the value is approximate or cached — never omit it to imply false real-time precision. */
  freshness?: DataFreshnessProps;
  className?: string;
}

/** KPI summary card: icon + value + optional trend + optional freshness. Prop-driven, no data fetching — the caller owns that. */
export function StatCard({ label, value, icon, tone = "neutral", trend, freshness, className }: StatCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon ? (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4",
              TONE_ICON_CLASSES[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {trend ? (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.direction === "up" ? "text-success" : "text-destructive",
            )}
          >
            {trend.direction === "up" ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {Math.abs(trend.value)}%
          </span>
        ) : null}
      </div>
      {freshness ? <DataFreshness {...freshness} /> : null}
    </div>
  );
}

export interface StatCardRowProps {
  className?: string;
  children: React.ReactNode;
  /** One freshness line for the whole row — every card in a row is treated as one snapshot from one statistics response, so freshness belongs here, not repeated per card (only pass `freshness` on an individual `StatCard` for a lone card outside a row). */
  freshness?: DataFreshnessProps;
}

/** `auto-fit`/`minmax` grid: N cards share the row evenly (4 cards ≈ 4 columns, 2 cards ≈ 2 columns) and wraps on narrow viewports with no explicit breakpoints needed — never a hardcoded column count. */
export function StatCardRow({ className, children, freshness }: StatCardRowProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">{children}</div>
      {freshness ? <DataFreshness {...freshness} /> : null}
    </div>
  );
}
