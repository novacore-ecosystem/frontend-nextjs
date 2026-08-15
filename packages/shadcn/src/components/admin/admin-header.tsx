import * as React from "react";
import { cn } from "../../lib/cn";
import { Separator } from "../ui/separator";
import { AdminSidebarToggle } from "./admin-layout";

export interface AdminHeaderProps {
  /** Freeform leading content — rendered after the app switcher/breadcrumb, before the trailing slots. Kept for simple/legacy usage; prefer the named slots below for a consistent layout. */
  children?: React.ReactNode;
  applicationSwitcher?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  search?: React.ReactNode;
  notifications?: React.ReactNode;
  localeSwitcher?: React.ReactNode;
  themeToggle?: React.ReactNode;
  actions?: React.ReactNode;
  userMenu?: React.ReactNode;
  className?: string;
}

/** Admin topbar: sidebar toggle + app switcher + breadcrumb on the left, search/notifications/locale/theme/actions/user menu on the right. Every slot is optional — pass only what the app needs. */
export function AdminHeader({
  children,
  applicationSwitcher,
  breadcrumb,
  search,
  notifications,
  localeSwitcher,
  themeToggle,
  actions,
  userMenu,
  className,
}: AdminHeaderProps) {
  const hasTrailing = search || notifications || localeSwitcher || themeToggle || actions || userMenu;

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <AdminSidebarToggle />
      {applicationSwitcher}
      {breadcrumb}
      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>

      {hasTrailing ? (
        <div className="flex shrink-0 items-center gap-1.5">
          {search}
          {notifications}
          {localeSwitcher}
          {themeToggle}
          {actions}
          {userMenu ? (
            <>
              <Separator orientation="vertical" className="mx-1 h-6" />
              {userMenu}
            </>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
