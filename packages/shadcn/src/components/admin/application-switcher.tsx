"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { ApplicationDefinition } from "./nav-types";

export interface ApplicationSwitcherProps {
  applications: ApplicationDefinition[];
  currentId: string;
  onSelect?: (application: ApplicationDefinition) => void;
  /** Heading shown above the list, e.g. "Business Ecosystem". */
  label?: string;
  className?: string;
}

/** Lets the current admin quickly jump between related NovaCore applications (OMS, CMS, ...). Applications are entirely consumer-supplied — nothing here is hard-coded. */
export function ApplicationSwitcher({ applications, currentId, onSelect, label = "Switch application", className }: ApplicationSwitcherProps) {
  const current = applications.find((app) => app.id === currentId) ?? applications[0];
  if (!current) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground",
            className,
          )}
        >
          <ApplicationMark application={current} />
          <span className="max-w-[10rem] truncate">{current.shortName ?? current.name}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {applications.map((app) => (
          <DropdownMenuItem key={app.id} onSelect={() => onSelect?.(app)} className="items-start gap-2.5 py-2">
            <ApplicationMark application={app} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{app.name}</span>
              {app.description ? <span className="truncate text-xs text-muted-foreground">{app.description}</span> : null}
            </div>
            {app.id === current.id ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ApplicationMark({ application }: { application: ApplicationDefinition }) {
  if (application.logo) return <>{application.logo}</>;
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
      style={{ backgroundColor: application.accent ?? "hsl(var(--nc-primary))" }}
    >
      {application.icon ?? (application.shortName ?? application.name).slice(0, 2).toUpperCase()}
    </span>
  );
}
