import { Info } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";

export interface HowToProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

/** Subtle, reusable page-level guidance box — icon + title + body + optional link. Content is always caller-supplied; this component has no domain knowledge of its own. */
export function HowTo({ icon, title, children, actionLabel, actionHref, className }: HowToProps) {
  return (
    <div className={cn("flex gap-3 rounded-lg border border-border bg-muted/30 p-4", className)}>
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-info/10 text-info">
        {icon ?? <Info className="size-4" />}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{title}</p>
        <div className="text-sm text-muted-foreground">{children}</div>
        {actionLabel && actionHref ? (
          <a href={actionHref} className="mt-1 w-fit text-sm font-medium text-primary hover:underline">
            {actionLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
