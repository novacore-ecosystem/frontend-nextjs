"use client";

import * as React from "react";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface UserProfileUser {
  name: string;
  role?: string;
  email?: string;
  avatarUrl?: string;
}

export interface UserProfileMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface UserProfileProps {
  user: UserProfileUser;
  /** Extra items rendered above the separator + logout action — Profile, Account Settings, Preferences, Theme, Language, etc. */
  items?: UserProfileMenuItem[];
  onLogout?: () => void;
  logoutLabel?: string;
  /** Disables the trigger and the logout item — e.g. while a logout request is in flight. */
  loading?: boolean;
  /** `full` = avatar + name + role + chevron, styled for the dark sidebar footer. `compact` = avatar only, styled for a light header. */
  variant?: "full" | "compact";
  align?: "start" | "center" | "end";
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Avatar + identity + dropdown (profile/preferences/logout) — reusable across any NovaCore
 * admin product. Two placements: the sidebar footer (`variant="full"`) and the header
 * (`variant="compact"`) can both use this component instead of a one-off per app.
 */
export function UserProfile({
  user,
  items = [],
  onLogout,
  logoutLabel = "Log out",
  loading,
  variant = "full",
  align = "end",
  className,
}: UserProfileProps) {
  const triggerClassName =
    variant === "full"
      ? "flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-sidebar-accent disabled:pointer-events-none disabled:opacity-50"
      : "flex items-center rounded-full transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-50";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" disabled={loading} className={cn(triggerClassName, className)}>
          <Avatar src={user.avatarUrl} alt={user.name} fallback={initials(user.name)} />
          {variant === "full" ? (
            <>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</span>
                {user.role ? <span className="truncate text-xs text-sidebar-foreground/60">{user.role}</span> : null}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
            </>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{user.name}</span>
          {user.email ? <span className="block truncate text-xs text-muted-foreground">{user.email}</span> : null}
        </DropdownMenuLabel>
        {items.length > 0 ? <DropdownMenuSeparator /> : null}
        {items.map((item) => (
          <DropdownMenuItem key={item.key} disabled={item.disabled} onSelect={item.onSelect}>
            {item.icon ? <span className="mr-2 flex h-4 w-4 items-center justify-center">{item.icon}</span> : null}
            {item.label}
          </DropdownMenuItem>
        ))}
        {onLogout ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive disabled={loading} onSelect={onLogout}>
              <span className="mr-2 flex h-4 w-4 items-center justify-center">
                <LogOut className="h-4 w-4" />
              </span>
              {logoutLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
