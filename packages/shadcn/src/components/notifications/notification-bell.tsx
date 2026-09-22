"use client";

import { Bell, Check, Loader2 } from "lucide-react";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import { EmptyState, ErrorState, SkeletonList } from "../admin/states";
import { RelativeTime } from "../admin/relative-time";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { NotificationItemContent } from "./notification-item-content";
import type { NotificationItem, NotificationRenderRegistry } from "./types";

export interface NotificationBellProps<T extends NotificationItem = NotificationItem> {
  items: T[];
  unreadCount: number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  /** Called when a row is clicked/activated. What happens next (open a detail view, navigate, fetch more fields) is entirely the host application's call — this module only owns the trigger, the drawer chrome, and the list. */
  onSelect?: (notification: T) => void;
  /** Omit to hide the per-row mark-as-read affordance entirely (e.g. an app that only marks read via `onSelect`). */
  onMarkAsRead?: (notification: T) => void;
  /** Omit to hide the "Mark all read" header action. */
  onMarkAllAsRead?: () => void;
  /** Per-type/category title/description overrides — see `NotificationItemContent`'s doc comment. */
  renderConfig?: NotificationRenderRegistry<T>;
  getRenderKey?: (notification: T) => string;
  /** Optional leading visual per row (e.g. a category icon) — deliberately a single row-level slot rather than a third `renderConfig` key, since unlike title/description it isn't something this module renders a default for. Omit for no leading visual at all. */
  renderIcon?: (notification: T) => React.ReactNode;
  /** Controlled open state for the drawer. Omit to let the component manage it internally (opened by clicking the bell). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Header-bar notification center: a bell trigger with an unread badge, opening a `Sheet` (Drawer/
 * Offcanvas) containing a scrollable, paginated list of notifications. Replaces a `Popover`-based
 * design specifically so the panel has room to grow (richer rows, filters, grouping) without
 * fighting a small fixed-size popup.
 *
 * Deliberately does not own data fetching, pagination, or real-time delivery — those are
 * inherently application/backend-specific (see nova-wcm's SignalR-hub-backed
 * `useNotificationBell`, which owns all of that and passes the resulting props straight through).
 * This component's whole job is the trigger, the drawer chrome, and rendering each item via
 * `NotificationItemContent` with the application's `renderConfig`.
 */
export function NotificationBell<T extends NotificationItem = NotificationItem>({
  items,
  unreadCount,
  loading,
  error,
  onRetry,
  hasMore,
  loadingMore,
  onLoadMore,
  onSelect,
  onMarkAsRead,
  onMarkAllAsRead,
  renderConfig,
  getRenderKey,
  renderIcon,
  open: controlledOpen,
  onOpenChange,
  className,
}: NotificationBellProps<T>) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Auto "load more" when the end of the list scrolls into view. Fires at most once per loaded item
  // count, so a failed request (count unchanged) can't spin in a retry loop - the manual button below
  // stays the retry path.
  // State (not a ref object) so the effect re-runs once the portaled sheet actually mounts the node.
  const [sentinelNode, setSentinelNode] = React.useState<HTMLDivElement | null>(null);
  const requestedForCount = React.useRef(-1);
  const itemCount = items.length;
  React.useEffect(() => {
    if (!open || !hasMore || loadingMore || !onLoadMore || !sentinelNode || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || requestedForCount.current === itemCount) return;
        requestedForCount.current = itemCount;
        onLoadMore();
      },
      { rootMargin: "120px" },
    );
    observer.observe(sentinelNode);
    return () => observer.disconnect();
  }, [open, hasMore, loadingMore, onLoadMore, itemCount, sentinelNode]);

  return (
    <>
      <button
        type="button"
        aria-label={t("notifications.triggerLabel")}
        onClick={() => setOpen(true)}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
          className,
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium leading-none text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader className="flex-row items-center justify-between space-y-0">
            <SheetTitle>{t("notifications.title")}</SheetTitle>
            {unreadCount > 0 && onMarkAllAsRead ? (
              <button type="button" onClick={onMarkAllAsRead} className="mr-6 text-xs text-primary hover:underline">
                {t("notifications.markAllRead")}
              </button>
            ) : null}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {loading ? (
              <SkeletonList rows={5} />
            ) : error ? (
              <ErrorState title={error} onRetry={onRetry} />
            ) : items.length === 0 ? (
              <EmptyState description={t("notifications.empty")} />
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {items.map((item) => {
                  const isUnread = item.status === "unread";
                  const icon = renderIcon?.(item);
                  return (
                    <div key={item.id} className={cn("flex items-start gap-2.5 py-3", isUnread && "bg-accent/30")}>
                      {icon ? (
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">{icon}</span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onSelect?.(item)}
                        className="flex min-w-0 flex-1 flex-col gap-1 text-left"
                      >
                        <NotificationItemContent notification={item} renderConfig={renderConfig} getRenderKey={getRenderKey} variant="row" />
                        <span className="text-xs text-muted-foreground">
                          <RelativeTime date={item.createdAt} />
                        </span>
                      </button>
                      {isUnread && onMarkAsRead ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0"
                          aria-label={t("notifications.markAsRead")}
                          onClick={() => onMarkAsRead(item)}
                        >
                          <Check className="size-3.5" />
                        </Button>
                      ) : null}
                    </div>
                  );
                })}

                {hasMore ? (
                  <div ref={setSentinelNode} className="flex justify-center py-3">
                    {loadingMore ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <button type="button" onClick={onLoadMore} className="text-xs text-muted-foreground hover:text-foreground">
                        {t("notifications.loadMore")}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
