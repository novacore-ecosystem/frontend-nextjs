import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

export interface AccessDeniedProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Strings are not localized here — pass translated copy from your own i18n setup via these props. */
  backLabel?: string;
  homeLabel?: string;
  backHref?: string;
  homeHref?: string;
  onBack?: () => void;
  onHome?: () => void;
  /** Extra content rendered between the description and the actions, e.g. a support-contact link. */
  children?: React.ReactNode;
  className?: string;
}

/** Reusable full-region access-denied state for `PermissionBoundary`'s default fallback or standalone route guards. UX only — the backend must still reject the underlying request. */
export function AccessDenied({
  title = "Access denied",
  description = "You do not have permission to access this page.",
  icon,
  backLabel = "Go back",
  homeLabel = "Go to dashboard",
  backHref,
  homeHref,
  onBack,
  onHome,
  children,
  className,
}: AccessDeniedProps) {
  const showBack = Boolean(onBack || backHref);
  const showHome = Boolean(onHome || homeHref);

  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        {icon ?? <ShieldAlert className="h-7 w-7" />}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
      {showBack || showHome ? (
        <div className="mt-2 flex items-center gap-2">
          {showBack ? (
            onBack ? (
              <Button variant="outline" size="sm" onClick={onBack}>
                {backLabel}
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href={backHref!}>{backLabel}</Link>
              </Button>
            )
          ) : null}
          {showHome ? (
            onHome ? (
              <Button size="sm" onClick={onHome}>
                {homeLabel}
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href={homeHref!}>{homeLabel}</Link>
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
