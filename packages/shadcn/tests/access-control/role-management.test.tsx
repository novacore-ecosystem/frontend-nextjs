import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { PermissionProvider } from "../../src/components/admin/permission-provider";
import { RoleManagement } from "../../src/components/access-control/role-management";
import { AccessControlPermissions } from "../../src/components/access-control/access-control-permissions";
import { createMockServices, MOCK_PERMISSIONS } from "./mocks";
import type { RoleRecord } from "../../src/components/access-control/types";

const SEED_ROLES: RoleRecord[] = [
  { id: "role-1", name: "Warehouse Manager", description: "Runs warehouse ops", permissionCount: 1 },
  { id: "role-2", name: "Support Agent", description: "Handles tickets", permissionCount: 0 },
];

function renderRoleManagement({ manage = true }: { manage?: boolean } = {}) {
  const services = createMockServices({ roles: SEED_ROLES, assignments: { "role:role-1": ["order:view"] } });
  const permissions = manage ? [AccessControlPermissions.role.view, AccessControlPermissions.role.manage] : [AccessControlPermissions.role.view];
  render(
    <PermissionProvider permissions={permissions}>
      <AccessControlProvider services={services}>
        <RoleManagement permissions={MOCK_PERMISSIONS} />
      </AccessControlProvider>
    </PermissionProvider>,
  );
  return { services };
}

describe("RoleManagement", () => {
  it("lists existing roles", async () => {
    renderRoleManagement();
    expect(await screen.findByText("Warehouse Manager")).toBeInTheDocument();
    expect(screen.getByText("Support Agent")).toBeInTheDocument();
  });

  it("filters the list by the search box", async () => {
    renderRoleManagement();
    await screen.findByText("Warehouse Manager");

    fireEvent.change(screen.getByPlaceholderText("Search roles…"), { target: { value: "Support" } });

    await waitFor(() => expect(screen.queryByText("Warehouse Manager")).not.toBeInTheDocument());
    expect(screen.getByText("Support Agent")).toBeInTheDocument();
  });

  it("without role:manage, hides Create/Edit/Delete entirely", async () => {
    renderRoleManagement({ manage: false });
    await screen.findByText("Warehouse Manager");

    expect(screen.queryByRole("button", { name: "Create role" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("creates a role and opens its edit sheet for permission assignment", async () => {
    const { services } = renderRoleManagement();
    await screen.findByText("Warehouse Manager");

    fireEvent.click(screen.getByRole("button", { name: "Create role" }));
    fireEvent.change(await screen.findByLabelText(/^Name/), { target: { value: "Auditor" } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(async () => {
      const list = await services.roles.getList({});
      expect(list.items.some((role) => role.name === "Auditor")).toBe(true);
    });

    // The edit sheet auto-opens for the freshly created role.
    expect(await screen.findByRole("heading", { name: "Auditor" })).toBeInTheDocument();
  });

  it("edits a role's name via the Details tab", async () => {
    const { services } = renderRoleManagement();
    const row = (await screen.findByText("Warehouse Manager")).closest("tr")!;

    fireEvent.click(within(row).getByRole("button", { name: "Edit" }));
    const nameInput = await screen.findByLabelText(/^Name/);
    fireEvent.change(nameInput, { target: { value: "Warehouse Lead" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(async () => {
      const updated = await services.roles.getById("role-1");
      expect(updated?.name).toBe("Warehouse Lead");
    });
  });

  it("deletes a role after confirmation", async () => {
    const { services } = renderRoleManagement();
    const row = (await screen.findByText("Support Agent")).closest("tr")!;

    fireEvent.click(within(row).getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(async () => {
      expect(await services.roles.getById("role-2")).toBeNull();
    });
    await waitFor(() => expect(screen.queryByText("Support Agent")).not.toBeInTheDocument());
  });
});
