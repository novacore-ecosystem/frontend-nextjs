"use client";

import {
  HttpError,
  NotificationEndpoints,
  translateError,
  type HttpClient,
  type Locale,
  type NotificationHubEvents,
  type NotificationPush,
  type NotificationSummary,
  type TranslationBundle,
  type TypedRealtimeHub,
} from "@novacore/frontend-foundation";
import * as React from "react";

/** What `RealtimeClient.forHub(NotificationHub)` (`@novacore/frontend-foundation`) returns — pass that value as `UseNotificationsOptions.hub` once your app has a live realtime connection. `NotificationHub` currently declares no invokable methods, hence `Record<string, never>`. */
export type NotificationRealtimeHub = TypedRealtimeHub<NotificationHubEvents, Record<string, never>>;

export interface UseNotificationsOptions {
  /** Locale error messages resolve in, forwarded to `translateError()`. */
  locale?: Locale;
  /** Tenant-specific error message overrides, forwarded to `translateError()`. */
  tenantTranslations?: TranslationBundle;
  /** Page size for `NotificationEndpoints.list`. Defaults to 20. */
  limit?: number;
  /**
   * A hub bound via `RealtimeClient.forHub(NotificationHub)` — see `NotificationRealtimeHub`.
   * Omit when the host application hasn't wired up a Global Hub connection (yet, or ever):
   * this hook then never attempts any realtime call at all (no retry loop against a
   * connection that doesn't exist) and reports `realtimeAvailable: false`, so the UI can
   * render a distinct "real-time updates unavailable" state instead of silently behaving as
   * if live delivery were working.
   */
  hub?: NotificationRealtimeHub;
  /** Fetches the first page automatically on mount. Defaults to `true`. */
  autoLoad?: boolean;
}

export interface UseNotificationsResult {
  items: NotificationSummary[];
  /** The backend-provided total from `NotificationEndpoints.getUnreadCount`, not an approximation over whatever page happens to be loaded. */
  unreadCount: number;
  /** `true` only for the initial/`refresh()` load. */
  loading: boolean;
  /** `true` only while `loadMore()` is in flight. */
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  clearError: () => void;
  /** `false` when no `hub` option was supplied — the cue to render a "real-time updates unavailable" state rather than assuming live delivery. */
  realtimeAvailable: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  /** Optimistically marks `notification` read locally, then calls the backend; rolled back on failure. Matches `NotificationBellProps.onMarkAsRead`'s shape. */
  markAsRead: (notification: Pick<NotificationSummary, "id">) => Promise<void>;
  /**
   * Optimistically marks every currently **loaded** unread item read, then calls the backend;
   * rolled back on failure. There is no bulk mark-all-read endpoint (confirmed absent, see
   * `NotificationEndpoints`'s doc comment), so this composes one `markAsRead` call per loaded
   * unread item — an item that hasn't been paged in yet is not affected. Matches
   * `NotificationBellProps.onMarkAllAsRead`'s shape.
   */
  markAllAsRead: () => Promise<void>;
}

function toTranslatableError(err: unknown): { messageCode?: string | null; message?: string } {
  if (err instanceof HttpError) return { messageCode: err.code, message: err.message };
  if (err instanceof Error) return { message: err.message };
  return { message: String(err) };
}

/**
 * Cursor-pagination + realtime-fallback data hook that pairs with the presentational
 * `NotificationBell` (`./notification-bell`) — built directly on
 * `@novacore/frontend-foundation`'s new `NotificationEndpoints`/`NotificationHub` + the shared
 * `HttpClient`. `NotificationBell` itself deliberately owns no data fetching (see
 * `docs/notifications.md`); this hook is the reference implementation of that missing half for
 * an application whose backend matches the foundation's notification contract.
 *
 * ```tsx
 * const notifications = useNotifications({ httpClient, hub: notificationHub });
 * <NotificationBell
 *   items={notifications.items}
 *   unreadCount={notifications.unreadCount}
 *   loading={notifications.loading}
 *   error={notifications.error}
 *   onRetry={notifications.refresh}
 *   hasMore={notifications.hasMore}
 *   loadingMore={notifications.loadingMore}
 *   onLoadMore={notifications.loadMore}
 *   onMarkAsRead={notifications.markAsRead}
 *   onMarkAllAsRead={notifications.markAllAsRead}
 * />
 * ```
 */
export function useNotifications(
  httpClient: HttpClient,
  options: UseNotificationsOptions = {},
): UseNotificationsResult {
  const { locale, tenantTranslations, limit = 20, hub, autoLoad = true } = options;
  const [items, setItems] = React.useState<NotificationSummary[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [loading, setLoading] = React.useState(Boolean(autoLoad));
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const cursorRef = React.useRef<string | null>(null);

  const reportError = React.useCallback(
    (err: unknown) => {
      setError(translateError(toTranslatableError(err), { locale, tenantOverrides: tenantTranslations }));
    },
    [locale, tenantTranslations],
  );

  // Fire-and-forget: the badge is a secondary signal, never worth blocking/failing the list load over.
  const refreshUnreadCount = React.useCallback(() => {
    httpClient
      .execute(NotificationEndpoints.getUnreadCount)
      .then((result) => setUnreadCount(result.unreadCount))
      .catch(() => undefined);
  }, [httpClient]);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await httpClient.execute(NotificationEndpoints.list, { limit });
      cursorRef.current = result.nextCursor;
      setItems(result.items);
      setHasMore(result.hasMore);
      refreshUnreadCount();
    } catch (err) {
      reportError(err);
    } finally {
      setLoading(false);
    }
  }, [httpClient, limit, reportError, refreshUnreadCount]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore || !cursorRef.current) return;
    setLoadingMore(true);
    setError(null);
    try {
      const result = await httpClient.execute(NotificationEndpoints.list, { cursor: cursorRef.current, limit });
      cursorRef.current = result.nextCursor;
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
    } catch (err) {
      reportError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [httpClient, limit, hasMore, loadingMore, reportError]);

  const markAsRead = React.useCallback(
    async (notification: Pick<NotificationSummary, "id">) => {
      const previous = items;
      const wasUnread = items.some((item) => item.id === notification.id && item.status === "unread");
      setItems((prev) => prev.map((item) => (item.id === notification.id ? { ...item, status: "read" } : item)));
      if (wasUnread) setUnreadCount((count) => Math.max(0, count - 1));
      try {
        await httpClient.execute(NotificationEndpoints.markAsRead, { id: notification.id });
      } catch (err) {
        setItems(previous);
        if (wasUnread) setUnreadCount((count) => count + 1);
        reportError(err);
      }
    },
    [httpClient, items, reportError],
  );

  // No bulk endpoint exists (see NotificationEndpoints's doc comment) — composed from individual
  // markAsRead calls against the currently loaded unread items only.
  const markAllAsRead = React.useCallback(async () => {
    const previous = items;
    const previousUnreadCount = unreadCount;
    const unreadIds = items.filter((item) => item.status === "unread").map((item) => item.id);
    if (unreadIds.length === 0) return;

    setItems((prev) => prev.map((item) => ({ ...item, status: "read" })));
    setUnreadCount((count) => Math.max(0, count - unreadIds.length));
    try {
      await Promise.all(unreadIds.map((id) => httpClient.execute(NotificationEndpoints.markAsRead, { id })));
    } catch (err) {
      setItems(previous);
      setUnreadCount(previousUnreadCount);
      reportError(err);
    }
  }, [httpClient, items, unreadCount, reportError]);

  const clearError = React.useCallback(() => setError(null), []);

  React.useEffect(() => {
    if (autoLoad) void refresh();
    // Intentionally mount-only — see `useUserProfile`'s matching autoLoad effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!hub) return;
    return hub.subscribe("ReceiveNotification", (notification: NotificationPush) => {
      // An id-less push has no Notification Center row to reconcile against (see NotificationPush's
      // doc comment) — refetch instead of guessing at a shape to prepend.
      if (!notification.id) {
        void refresh();
        return;
      }
      const summary: NotificationSummary = { ...notification, id: notification.id };
      setItems((prev) => (prev.some((item) => item.id === summary.id) ? prev : [summary, ...prev]));
      if (summary.status === "unread") setUnreadCount((count) => count + 1);
    });
  }, [hub, refresh]);

  const realtimeAvailable = Boolean(hub);

  return React.useMemo(
    () => ({
      items,
      unreadCount,
      loading,
      loadingMore,
      hasMore,
      error,
      clearError,
      realtimeAvailable,
      refresh,
      loadMore,
      markAsRead,
      markAllAsRead,
    }),
    [items, unreadCount, loading, loadingMore, hasMore, error, clearError, realtimeAvailable, refresh, loadMore, markAsRead, markAllAsRead],
  );
}
