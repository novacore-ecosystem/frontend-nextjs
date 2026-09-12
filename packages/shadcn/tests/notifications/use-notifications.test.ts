import { act, renderHook, waitFor } from "@testing-library/react";
import { NotificationEndpoints, type HttpClient, type NotificationSummary } from "@novacore/frontend-foundation";
import { describe, expect, it, vi } from "vitest";
import { useNotifications, type NotificationRealtimeHub } from "../../src/components/notifications/use-notifications";

function createMockHttpClient(execute: ReturnType<typeof vi.fn>): HttpClient {
  return { execute } as unknown as HttpClient;
}

function notification(id: string, status: NotificationSummary["status"] = "unread"): NotificationSummary {
  return { id, title: `Notification ${id}`, createdAt: "2026-09-13T00:00:00Z", status };
}

describe("useNotifications", () => {
  it("loads the first page on mount and derives unreadCount from the loaded items", async () => {
    const execute = vi.fn().mockResolvedValue({
      items: [notification("1"), notification("2", "read")],
      nextCursor: "cursor-2",
      hasMore: true,
    });
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useNotifications(httpClient));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(execute).toHaveBeenCalledWith(NotificationEndpoints.list, { limit: 20 });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.realtimeAvailable).toBe(false);
  });

  it("loadMore appends the next page using the cursor from the previous response", async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce({ items: [notification("1")], nextCursor: "cursor-2", hasMore: true })
      .mockResolvedValueOnce({ items: [notification("2")], nextCursor: null, hasMore: false });
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useNotifications(httpClient, { limit: 1 }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loadMore();
    });

    expect(execute).toHaveBeenLastCalledWith(NotificationEndpoints.list, { cursor: "cursor-2", limit: 1 });
    expect(result.current.items.map((item) => item.id)).toEqual(["1", "2"]);
    expect(result.current.hasMore).toBe(false);
  });

  it("markAsRead is optimistic and rolls back on failure", async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce({ items: [notification("1")], nextCursor: null, hasMore: false })
      .mockRejectedValueOnce(new Error("network down"));
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useNotifications(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.markAsRead({ id: "1" });
    });

    // The backend call failed -> optimistic "read" flip is rolled back to "unread".
    expect(result.current.items[0]!.status).toBe("unread");
    expect(result.current.error).not.toBeNull();
  });

  it("markAllAsRead marks every loaded item read on success", async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce({ items: [notification("1"), notification("2")], nextCursor: null, hasMore: false })
      .mockResolvedValueOnce(undefined);
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useNotifications(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.markAllAsRead();
    });

    expect(result.current.items.every((item) => item.status === "read")).toBe(true);
    expect(result.current.unreadCount).toBe(0);
  });

  it("with no `hub` option, never subscribes and reports realtimeAvailable: false (no retry loop against a missing connection)", async () => {
    const execute = vi.fn().mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useNotifications(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.realtimeAvailable).toBe(false);
  });

  it("with a `hub` option, subscribes to NotificationCreated and prepends pushed notifications", async () => {
    const execute = vi.fn().mockResolvedValue({ items: [notification("1")], nextCursor: null, hasMore: false });
    const httpClient = createMockHttpClient(execute);

    let pushedHandler: ((payload: NotificationSummary) => void) | undefined;
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
    expect(hub.subscribe).toHaveBeenCalledWith("NotificationCreated", expect.any(Function));

    act(() => {
      pushedHandler?.(notification("2"));
    });

    expect(result.current.items.map((item) => item.id)).toEqual(["2", "1"]);
  });
});
