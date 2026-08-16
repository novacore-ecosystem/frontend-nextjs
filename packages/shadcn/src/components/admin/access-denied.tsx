"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

export interface AccessDeniedProps {
  /** Defaults resolve via the shared translation system (`accessDenied.*`) — pass these only for an intentional override. */
  title?: string;
  description?: string;
  icon?: React.ReactNode;
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
  title,
  description,
  icon,
  backLabel,
  homeLabel,
  backHref,
  homeHref,
  onBack,
  onHome,
  children,
  className,
}: AccessDeniedProps) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("accessDenied.title");
  const resolvedDescription = description ?? t("accessDenied.description");
  const resolvedBackLabel = backLabel ?? t("accessDenied.backLabel");
  const resolvedHomeLabel = homeLabel ?? t("accessDenied.homeLabel");
  const showBack = Boolean(onBack || backHref);
  const showHome = Boolean(onHome || homeHref);

  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        {icon ?? <ShieldAlert className="h-7 w-7" />}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">{resolvedTitle}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{resolvedDescription}</p>
      </div>
      {children}
      {showBack || showHome ? (
        <div className="mt-2 flex items-center gap-2">
          {showBack ? (
            onBack ? (
              <Button variant="outline" size="sm" onClick={onBack}>
                {resolvedBackLabel}
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href={backHref!}>{resolvedBackLabel}</Link>
              </Button>
            )
          ) : null}
          {showHome ? (
            onHome ? (
              <Button size="sm" onClick={onHome}>
                {resolvedHomeLabel}
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href={homeHref!}>{resolvedHomeLabel}</Link>
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
