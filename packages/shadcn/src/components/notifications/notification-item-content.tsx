import * as React from "react";
import { cn } from "../../lib/cn";
import type { NotificationItem, NotificationRenderRegistry } from "./types";

export interface NotificationItemContentProps<T extends NotificationItem = NotificationItem> {
  notification: T;
  /** Keyed by `getRenderKey(notification)` — see that prop's doc comment. */
  renderConfig?: NotificationRenderRegistry<T>;
  /** Resolves which `renderConfig` entry applies to `notification`. Defaults to `notification.category`. */
  getRenderKey?: (notification: T) => string;
  /** `"row"` (default) clamps the description to 2 lines for a scannable list; `"detail"` shows it in full. Purely presentational — both variants use the same title/description override resolution. */
  variant?: "row" | "detail";
  className?: string;
}

/**
 * The one place a notification's title and description are resolved and rendered — used by
 * `NotificationBell`'s list rows, and reusable directly by an application building its own
 * notification surface (a detail page, a toast, ...) that still wants the same per-type
 * `renderConfig` to apply. Title and description are always two separate `div`s (never merged into
 * one text node) specifically so an app's custom `description` component can occupy the full item
 * width/height when `title` is suppressed, without fighting leftover title-div spacing.
 */
export function NotificationItemContent<T extends NotificationItem = NotificationItem>({
  notification,
  renderConfig,
  getRenderKey = (item) => item.category ?? "",
  variant = "row",
  className,
}: NotificationItemContentProps<T>) {
  const config = renderConfig?.[getRenderKey(notification)];

  // `config.title` unset -> default text. Explicit `null` -> no title div at all. A component -> custom title content.
  const TitleComponent = config?.title;
  const titleSuppressed = TitleComponent === null;

  const DescriptionComponent = config?.description;
  const hasDescriptionContent = Boolean(DescriptionComponent) || Boolean(notification.description);

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {titleSuppressed ? null : (
        <div className={cn(variant === "row" ? "truncate text-sm font-medium" : "text-sm font-semibold")}>
          {TitleComponent ? <TitleComponent notification={notification} /> : notification.title}
        </div>
      )}
      {hasDescriptionContent ? (
        <div
          className={cn(
            "whitespace-pre-wrap text-sm",
            variant === "row" ? "line-clamp-2 text-muted-foreground" : "text-foreground",
          )}
        >
          {DescriptionComponent ? <DescriptionComponent notification={notification} /> : notification.description}
        </div>
      ) : null}
    </div>
  );
}
