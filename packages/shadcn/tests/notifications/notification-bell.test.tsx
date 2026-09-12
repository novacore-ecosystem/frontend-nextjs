import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NotificationBell } from "../../src/components/notifications/notification-bell";
import type { NotificationItem, NotificationRenderRegistry } from "../../src/components/notifications/types";

const ITEMS: NotificationItem[] = [
  { id: "n1", title: "Order shipped", description: "Order #123 shipped.", createdAt: "2026-09-01T00:00:00.000Z", status: "unread", category: "order" },
  { id: "n2", title: "Password changed", createdAt: "2026-08-30T00:00:00.000Z", status: "read", category: "system" },
];

describe("NotificationBell", () => {
  it("shows the unread count badge and opens the drawer on click", () => {
    render(<NotificationBell items={ITEMS} unreadCount={1} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Notifications" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    expect(screen.getByText("Order shipped")).toBeInTheDocument();
    expect(screen.getByText("Password changed")).toBeInTheDocument();
  });

  it("caps the badge at 9+", () => {
    render(<NotificationBell items={ITEMS} unreadCount={15} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("shows no badge when there are no unread notifications", () => {
    const { container } = render(<NotificationBell items={ITEMS} unreadCount={0} />);
    expect(container.querySelector(".bg-destructive")).not.toBeInTheDocument();
  });

  it("shows a loading skeleton instead of the empty/error state while loading", () => {
    // Sheet content is rendered via a Radix Portal (attached to document.body), not inside RTL's
    // local `container` - query against the document, not the container, to actually see it.
    const { rerender } = render(<NotificationBell items={[]} unreadCount={0} loading open />);
    expect(screen.queryByText("No notifications yet")).not.toBeInTheDocument();
    expect(document.querySelectorAll('[class*="animate-pulse"]').length).toBeGreaterThan(0);

    rerender(<NotificationBell items={[]} unreadCount={0} error="Network error" open />);
    expect(screen.getByText("Network error")).toBeInTheDocument();

    rerender(<NotificationBell items={[]} unreadCount={0} open />);
    expect(screen.getByText("No notifications yet")).toBeInTheDocument();
  });

  it("calls onRetry from the error state's retry button", () => {
    const onRetry = vi.fn();
    render(<NotificationBell items={[]} unreadCount={0} error="Boom" onRetry={onRetry} open />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect when a row is clicked", () => {
    const onSelect = vi.fn();
    render(<NotificationBell items={ITEMS} unreadCount={1} onSelect={onSelect} open />);
    fireEvent.click(screen.getByText("Order shipped"));
    expect(onSelect).toHaveBeenCalledWith(ITEMS[0]);
  });

  it("only shows the mark-as-read button on unread rows, and calls the callback", () => {
    const onMarkAsRead = vi.fn();
    render(<NotificationBell items={ITEMS} unreadCount={1} onMarkAsRead={onMarkAsRead} open />);
    const markButtons = screen.getAllByRole("button", { name: "Mark as read" });
    expect(markButtons).toHaveLength(1);
    fireEvent.click(markButtons[0]);
    expect(onMarkAsRead).toHaveBeenCalledWith(ITEMS[0]);
  });

  it("hides Mark all read when no unread items or no callback is provided", () => {
    const { rerender } = render(<NotificationBell items={ITEMS} unreadCount={0} onMarkAllAsRead={vi.fn()} open />);
    expect(screen.queryByText("Mark all read")).not.toBeInTheDocument();

    rerender(<NotificationBell items={ITEMS} unreadCount={1} open />);
    expect(screen.queryByText("Mark all read")).not.toBeInTheDocument();
  });

  it("calls onMarkAllAsRead when present and there are unread items", () => {
    const onMarkAllAsRead = vi.fn();
    render(<NotificationBell items={ITEMS} unreadCount={1} onMarkAllAsRead={onMarkAllAsRead} open />);
    fireEvent.click(screen.getByText("Mark all read"));
    expect(onMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it("shows Load more only when hasMore is true, and calls onLoadMore", () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(<NotificationBell items={ITEMS} unreadCount={0} open />);
    expect(screen.queryByText("Load more")).not.toBeInTheDocument();

    rerender(<NotificationBell items={ITEMS} unreadCount={0} hasMore onLoadMore={onLoadMore} open />);
    fireEvent.click(screen.getByText("Load more"));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("applies renderConfig to rows inside the drawer", () => {
    function CustomDescription({ notification }: { notification: NotificationItem }) {
      return <span data-testid="custom">{notification.title} (custom)</span>;
    }
    const renderConfig: NotificationRenderRegistry = { order: { description: CustomDescription } };
    render(<NotificationBell items={ITEMS} unreadCount={1} renderConfig={renderConfig} open />);
    expect(screen.getByTestId("custom")).toHaveTextContent("Order shipped (custom)");
  });
});
