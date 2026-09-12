import type * as React from "react";

export type NotificationStatus = "read" | "unread";

/**
 * The shape this module renders. A consuming application maps its own domain notification type
 * onto this before passing it to `NotificationBell` — same "resolved record" pattern as
 * `PermissionRecord`/`SubjectOption` in the Access Control module. `description` is optional
 * because many real backends only return it on a per-notification detail fetch, not in a list
 * summary (confirmed against nova-wcm's actual `GET /user-notifications/me` vs.
 * `GET /user-notifications/{id}` contract) — a row with no `description` and no custom
 * `description` component configured simply renders no description content, which is correct,
 * not a bug to work around.
 */
export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  status: NotificationStatus;
  /** Used by the default `getRenderKey` to look up a `renderConfig` entry. Optional — an app that keys by something else (e.g. `type`) supplies its own `getRenderKey` instead. */
  category?: string;
}

export interface NotificationRenderComponentProps<T extends NotificationItem = NotificationItem> {
  notification: T;
}

/**
 * Per-type/category override for how one notification's title and/or description render.
 * Omitting a key entirely (no entry in `NotificationRenderRegistry` for this notification) keeps
 * both defaults. Within one entry: omitting `title` keeps the default title; an explicit `null`
 * suppresses the title div entirely (for a full redesign where `description` renders everything,
 * including its own heading); a component swaps in custom title content. `description` has no
 * `null` variant — there's no "default description with nothing" state worth naming, since the
 * default already renders nothing when `notification.description` is empty.
 */
export interface NotificationTypeRenderConfig<T extends NotificationItem = NotificationItem> {
  title?: React.ComponentType<NotificationRenderComponentProps<T>> | null;
  description?: React.ComponentType<NotificationRenderComponentProps<T>>;
}

export type NotificationRenderRegistry<T extends NotificationItem = NotificationItem> = Record<
  string,
  NotificationTypeRenderConfig<T>
>;
