import * as React from "react";
import { cn } from "../../lib/cn";

export function AdminPage({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-col gap-6 p-4 md:p-6", className)}>{children}</div>;
}

export function PageContainer({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl", className)}>{children}</div>;
}

export function PageSection({
  title,
  description,
  actions,
  className,
  children,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Rendered inline next to the title, e.g. a `StatusBadge`. */
  status?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, status, actions, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {breadcrumb}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {status}
          </div>
          {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function Toolbar({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

export function ContentPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-lg border border-border bg-card p-4", className)}>{children}</div>;
}
