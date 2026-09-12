import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotificationItemContent } from "../../src/components/notifications/notification-item-content";
import type { NotificationItem, NotificationRenderRegistry } from "../../src/components/notifications/types";

const BASE: NotificationItem = {
  id: "n1",
  title: "Order shipped",
  description: "Your order #123 has shipped.",
  createdAt: "2026-09-01T00:00:00.000Z",
  status: "unread",
  category: "order",
};

function CustomTitle({ notification }: { notification: NotificationItem }) {
  return <span data-testid="custom-title">Custom: {notification.title}</span>;
}

function CustomDescription({ notification }: { notification: NotificationItem }) {
  return (
    <div data-testid="custom-description">
      <strong>{notification.title}</strong> — {notification.description}
    </div>
  );
}

describe("NotificationItemContent", () => {
  it("renders the default title and description when no renderConfig is supplied", () => {
    render(<NotificationItemContent notification={BASE} />);
    expect(screen.getByText("Order shipped")).toBeInTheDocument();
    expect(screen.getByText("Your order #123 has shipped.")).toBeInTheDocument();
  });

  it("renders no description content when the notification has none and nothing is configured", () => {
    render(<NotificationItemContent notification={{ ...BASE, description: undefined }} />);
    expect(screen.getByText("Order shipped")).toBeInTheDocument();
    expect(screen.queryByText(/has shipped/)).not.toBeInTheDocument();
  });

  it("keeps the default title when only a description override is configured", () => {
    function DescriptionOnly({ notification }: { notification: NotificationItem }) {
      return <span data-testid="custom-description">Shipped via {notification.description}</span>;
    }
    const renderConfig: NotificationRenderRegistry = { order: { description: DescriptionOnly } };
    render(<NotificationItemContent notification={BASE} renderConfig={renderConfig} />);
    expect(screen.getByText("Order shipped")).toBeInTheDocument();
    expect(screen.getByTestId("custom-description")).toBeInTheDocument();
  });

  it("suppresses the title div entirely when title is explicitly null", () => {
    const renderConfig: NotificationRenderRegistry = { order: { title: null, description: CustomDescription } };
    const { container } = render(<NotificationItemContent notification={BASE} renderConfig={renderConfig} />);
    // The custom description component renders its own heading text - the default title div must not also be present.
    expect(container.querySelectorAll('[class*="font-medium"]').length).toBe(0);
    expect(screen.getByTestId("custom-description")).toBeInTheDocument();
  });

  it("swaps in a custom title component when configured", () => {
    const renderConfig: NotificationRenderRegistry = { order: { title: CustomTitle } };
    render(<NotificationItemContent notification={BASE} renderConfig={renderConfig} />);
    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    expect(screen.queryByText("Order shipped")).not.toBeInTheDocument();
  });

  it("resolves renderConfig via a custom getRenderKey instead of category", () => {
    const renderConfig: NotificationRenderRegistry = { "order:shipped": { title: CustomTitle } };
    render(
      <NotificationItemContent
        notification={{ ...BASE, category: "order" }}
        renderConfig={renderConfig}
        getRenderKey={(n) => `${n.category}:shipped`}
      />,
    );
    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
  });

  it("an unconfigured category falls back to full default rendering", () => {
    render(<NotificationItemContent notification={{ ...BASE, category: "billing" }} renderConfig={{ order: { title: null } }} />);
    expect(screen.getByText("Order shipped")).toBeInTheDocument();
  });
});
