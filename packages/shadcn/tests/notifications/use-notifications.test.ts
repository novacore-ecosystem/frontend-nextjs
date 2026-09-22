import { act, renderHook, waitFor } from "@testing-library/react";
import {
  NotificationEndpoints,
  type EndpointDefinition,
  type HttpClient,
  type NotificationPush,
  type NotificationSummary,
} from "@novacore/frontend-foundation";
import { describe, expect, it, vi } from "vitest";
import { useNotifications, type NotificationRealtimeHub } from "../../src/components/notifications/use-notifications";

/**
 * Routes by endpoint identity rather than call order — `refreshUnreadCount()` is fire-and-forget
 * (never awaited by `refresh()`/`loadMore()`), so a purely positional `mockResolvedValueOnce`
 * queue is order-fragile against it. `list`/`getUnreadCount` default to empty/zero so a test only
 * needs to override what it cares about.
 */
function createMockHttpClient(overrides: {
  list?: () => unknown;
  unreadCount?: () => { unreadCount: number };
  markAsRead?: () => unknown;
}): HttpClient {
  const execute = vi.fn((def: EndpointDefinition<unknown, unknown>) => {
    if (def === NotificationEndpoints.list) {
      return Promise.resolve(overrides.list?.() ?? { items: [], nextCursor: null, hasMore: false });
    }
    if (def === NotificationEndpoints.getUnreadCount) {
      return Promise.resolve(overrides.unreadCount?.() ?? { unreadCount: 0 });
    }
    if (def === NotificationEndpoints.markAsRead) {
      return overrides.markAsRead ? Promise.resolve(overrides.markAsRead()) : Promise.resolve(undefined);
    }
    return Promise.reject(new Error(`Unexpected endpoint in test: ${String(def)}`));
  });
  return { execute } as unknown as HttpClient;
}

function notification(id: string, status: NotificationSummary["status"] = "unread"): NotificationSummary {
  return { id, title: `Notification ${id}`, createdAt: "2026-09-13T00:00:00Z", status };
}

describe("useNotifications", () => {
  it("loads the first page and the backend-provided unread count on mount", async () => {
    const httpClient = createMockHttpClient({
      list: () => ({ items: [notification("1"), notification("2", "read")], nextCursor: "cursor-2", hasMore: true }),
      unreadCount: () => ({ unreadCount: 5 }),
    });
    const { result } = renderHook(() => useNotifications(httpClient));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(httpClient.execute).toHaveBeenCalledWith(NotificationEndpoints.list, { limit: 20 });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.realtimeAvailable).toBe(false);
    // Backend-provided total (5), not a derived count over the two loaded items (1).
    await waitFor(() => expect(result.current.unreadCount).toBe(5));
  });

  it("loadMore appends the next page using the cursor from the previous response", async () => {
    let page = 0;
    const httpClient = createMockHttpClient({
      list: () => {
        page += 1;
        return page === 1
          ? { items: [notification("1")], nextCursor: "cursor-2", hasMore: true }
          : { items: [notification("2")], nextCursor: null, hasMore: false };
      },
    });
    const { result } = renderHook(() => useNotifications(httpClient, { limit: 1 }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(httpClient.execute).toHaveBeenLastCalledWith(NotificationEndpoints.list, { cursor: "cursor-2", limit: 1 });
    expect(result.current.items.map((item) => item.id)).toEqual(["1", "2"]);
    expect(result.current.hasMore).toBe(false);
  });

  it("markAsRead is optimistic and rolls back both the item and the count on failure", async () => {
    const httpClient = createMockHttpClient({
      list: () => ({ items: [notification("1")], nextCursor: null, hasMore: false }),
      unreadCount: () => ({ unreadCount: 1 }),
    });
    const { result } = renderHook(() => useNotifications(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.unreadCount).toBe(1));

    vi.mocked(httpClient.execute).mockImplementationOnce(() => Promise.reject(new Error("network down")));
    await act(async () => {
      await result.current.markAsRead({ id: "1" });
    });

    // The backend call failed -> both the optimistic "read" flip and the count decrement roll back.
    expect(result.current.items[0]!.status).toBe("unread");
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.error).not.toBeNull();
  });

  it("markAllAsRead composes individual markAsRead calls for every loaded unread item (no bulk endpoint exists)", async () => {
    const httpClient = createMockHttpClient({
      list: () => ({ items: [notification("1"), notification("2"), notification("3", "read")], nextCursor: null, hasMore: false }),
      unreadCount: () => ({ unreadCount: 2 }),
    });
    const { result } = renderHook(() => useNotifications(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.unreadCount).toBe(2));

    await act(async () => {
      await result.current.markAllAsRead();
    });

    expect(result.current.items.every((item) => item.status === "read")).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(httpClient.execute).toHaveBeenCalledWith(NotificationEndpoints.markAsRead, { id: "1" });
    expect(httpClient.execute).toHaveBeenCalledWith(NotificationEndpoints.markAsRead, { id: "2" });
    expect(httpClient.execute).not.toHaveBeenCalledWith(NotificationEndpoints.markAsRead, { id: "3" });
  });

  it("with no `hub` option, never subscribes and reports realtimeAvailable: false (no retry loop against a missing connection)", async () => {
    const httpClient = createMockHttpClient({});
    const { result } = renderHook(() => useNotifications(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.realtimeAvailable).toBe(false);
  });

  it("with a `hub` option, subscribes to ReceiveNotification and prepends pushed notifications with an id", async () => {
    const httpClient = createMockHttpClient({
      list: () => ({ items: [notification("1")], nextCursor: null, hasMore: false }),
    });

    let pushedHandler: ((payload: NotificationPush) => void) | undefined;
    const unsubscribe = vi.fn();
    const hub: NotificationRealtimeHub = {
      subscribe: vi.fn((_event, handler) => {
        pushedHandler = handler;
        return unsubscribe;
      }),
      invoke: vi.fn(),
    };

    const { result } = renderHook(() => useNotifications(httpClient, { hub }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.realtimeAvailable).toBe(true);
    expect(hub.subscribe).toHaveBeenCalledWith("ReceiveNotification", expect.any(Function));

    act(() => {
      pushedHandler?.(notification("2"));
    });

    expect(result.current.items.map((item) => item.id)).toEqual(["2", "1"]);
    expect(result.current.unreadCount).toBe(1);
  });

  it("refetches instead of prepending when a push has no id (no Notification Center row to reconcile against)", async () => {
    let listCalls = 0;
    const httpClient = createMockHttpClient({
      list: () => {
        listCalls += 1;
        return { items: [notification("1")], nextCursor: null, hasMore: false };
      },
    });

    let pushedHandler: ((payload: NotificationPush) => void) | undefined;
    const hub: NotificationRealtimeHub = {
      subscribe: vi.fn((_event, handler) => {
        pushedHandler = handler;
        return vi.fn();
      }),
      invoke: vi.fn(),
    };

    renderHook(() => useNotifications(httpClient, { hub }));
    await waitFor(() => expect(listCalls).toBe(1));

    act(() => {
      pushedHandler?.({ ...notification("2"), id: null });
    });

    await waitFor(() => expect(listCalls).toBe(2));
  });
});
