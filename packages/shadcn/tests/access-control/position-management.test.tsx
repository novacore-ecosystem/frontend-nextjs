import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { PermissionProvider } from "../../src/components/admin/permission-provider";
import { PositionManagement } from "../../src/components/access-control/position-management";
import { AccessControlPermissions } from "../../src/components/access-control/access-control-permissions";
import { createMockServices } from "./mocks";
import type { PositionRecord } from "../../src/components/access-control/types";

const SEED_POSITIONS: PositionRecord[] = [
  { id: "pos-1", name: "Regional Director", parentId: null },
  { id: "pos-2", name: "Store Manager", parentId: "pos-1" },
  { id: "pos-3", name: "Cashier", parentId: "pos-2" },
];

function renderPositionManagement() {
  const services = createMockServices({ positions: SEED_POSITIONS });
  render(
    <PermissionProvider permissions={[AccessControlPermissions.position.view, AccessControlPermissions.position.manage]}>
      <AccessControlProvider services={services}>
        <PositionManagement />
      </AccessControlProvider>
    </PermissionProvider>,
  );
  return { services };
}

describe("PositionManagement — hierarchy", () => {
  it("renders the tree with every position visible by default (expanded)", async () => {
    renderPositionManagement();
    expect(await screen.findByText("Regional Director")).toBeInTheDocument();
    expect(screen.getByText("Store Manager")).toBeInTheDocument();
    expect(screen.getByText("Cashier")).toBeInTheDocument();
  });

  it("switching to List view shows the same positions as flat rows with a Superior column", async () => {
    renderPositionManagement();
    await screen.findByText("Regional Director");

    fireEvent.click(screen.getByRole("button", { name: "List" }));

    expect(await screen.findByText("Superior")).toBeInTheDocument();
    expect(screen.getAllByText("Regional Director").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Store Manager").length).toBeGreaterThan(0);
  });

  it("search filters the tree, keeping ancestors of a match visible", async () => {
    renderPositionManagement();
    await screen.findByText("Regional Director");

    fireEvent.change(screen.getByPlaceholderText("Search positions…"), { target: { value: "Cashier" } });

    expect(await screen.findByText("Cashier")).toBeInTheDocument();
    expect(screen.getByText("Regional Director")).toBeInTheDocument();
    expect(screen.getByText("Store Manager")).toBeInTheDocument();
  });

  it("a non-matching search shows the empty state", async () => {
    renderPositionManagement();
    await screen.findByText("Regional Director");

    fireEvent.change(screen.getByPlaceholderText("Search positions…"), { target: { value: "nonexistent" } });

    expect(await screen.findByText("No positions match your search.")).toBeInTheDocument();
  });
});

describe("PositionManagement — create/edit/delete", () => {
  it("creates a root position and opens its edit sheet", async () => {
    const { services } = renderPositionManagement();
    await screen.findByText("Regional Director");

    fireEvent.click(screen.getByRole("button", { name: "Create position" }));
    fireEvent.change(await screen.findByLabelText(/^Name/), { target: { value: "VP of Operations" } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(async () => {
      const list = await services.positions.getList({});
      expect(list.items.some((p) => p.name === "VP of Operations" && p.parentId === null)).toBe(true);
    });
    expect(await screen.findByRole("heading", { name: "VP of Operations" })).toBeInTheDocument();
  });

  it("the parent selector on the edit sheet excludes the position itself and its descendants (no cycles)", async () => {
    renderPositionManagement();
    const row = (await screen.findByText("Regional Director")).closest(".group")!;

    fireEvent.click(within(row).getByRole("button", { name: "Edit" }));
    await screen.findByLabelText(/^Name/);

    // "Regional Director" is being edited — it must not be selectable as its own superior,
    // nor may any of its descendants (Store Manager, Cashier).
    fireEvent.click(screen.getByLabelText("Superior position"));
    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).queryByText("Regional Director")).not.toBeInTheDocument();
    expect(within(listbox).queryByText("Store Manager")).not.toBeInTheDocument();
    expect(within(listbox).queryByText("Cashier")).not.toBeInTheDocument();
  });

  it("deleting a position with subordinates is blocked with an explanatory message", async () => {
    const { services } = renderPositionManagement();
    const row = (await screen.findByText("Store Manager")).closest(".group")!;

    fireEvent.click(within(row).getByRole("button", { name: "Delete" }));
    expect(await screen.findByText(/reassign or delete them first/i)).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    // Still present — the blocked confirm is a no-op.
    expect(await services.positions.getById("pos-2")).not.toBeNull();
  });

  it("deleting a leaf position (no subordinates) succeeds", async () => {
    const { services } = renderPositionManagement();
    const row = (await screen.findByText("Cashier")).closest(".group")!;

    fireEvent.click(within(row).getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(async () => {
      expect(await services.positions.getById("pos-3")).toBeNull();
    });
  });
});
