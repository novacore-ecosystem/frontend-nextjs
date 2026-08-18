import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { UserPermissionAssignment } from "../../src/components/access-control/user-permission-assignment";
import { createMockServices, createMockSubjectProvider, MOCK_PERMISSIONS } from "./mocks";
import type { RoleRecord, SubjectOption } from "../../src/components/access-control/types";

const SEED_USERS: SubjectOption[] = [
  { id: "user-1", displayName: "John Doe", secondaryText: "john@example.com" },
  { id: "user-2", displayName: "Jane Doe", secondaryText: "jane@example.com" },
  { id: "user-3", displayName: "David Smith", secondaryText: "david@example.com" },
];

const SEED_ROLES: RoleRecord[] = [{ id: "role-1", name: "Order Manager", permissionCount: 2 }];

function renderUserPermissionAssignment(options?: {
  assignments?: Record<string, string[]>;
  roleAssignments?: Record<string, string[]>;
  getDetailHref?: (id: string) => string;
}) {
  const services = createMockServices({ roles: SEED_ROLES, assignments: options?.assignments, roleAssignments: options?.roleAssignments });
  const subjectProvider = createMockSubjectProvider(SEED_USERS);
  render(
    <AccessControlProvider services={services}>
      <UserPermissionAssignment
        permissions={MOCK_PERMISSIONS}
        subjectProvider={subjectProvider}
        getDetailHref={options?.getDetailHref}
      />
    </AccessControlProvider>,
  );
  return { services };
}

function rowFor(name: string) {
  return screen.findByText(name).then((el) => el.closest("tr")!);
}

describe("UserPermissionAssignment", () => {
  it("lists users from the subject provider and prompts for selection", async () => {
    renderUserPermissionAssignment();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Select one or more users above to manage their authorization.")).toBeInTheDocument();
  });

  it("search filters the user list", async () => {
    renderUserPermissionAssignment();
    await screen.findByText("John Doe");

    fireEvent.change(screen.getByPlaceholderText("Search users…"), { target: { value: "David" } });

    await waitFor(() => expect(screen.queryByText("John Doe")).not.toBeInTheDocument());
    expect(screen.getByText("David Smith")).toBeInTheDocument();
  });

  it("selecting exactly one user shows Roles/Direct Permissions tabs, pre-checked with current state, plus a detail link", async () => {
    renderUserPermissionAssignment({
      assignments: { "user:user-1": ["order:view"] },
      roleAssignments: { "user:user-1": ["role-1"] },
      getDetailHref: (id) => `/access-control/user-permissions/${id}`,
    });
    const row = await rowFor("John Doe");

    fireEvent.click(within(row).getByRole("checkbox"));

    expect(await screen.findByText("1 selected")).toBeInTheDocument();
    // Roles tab is the default.
    const roleRow = (await screen.findByText("Order Manager")).closest("tr")!;
    expect(within(roleRow).getByRole("checkbox")).toBeChecked();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Direct Permissions" }));
    expect(await screen.findByRole("checkbox", { name: /View orders/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Manage orders/ })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Open full authorization detail" })).toHaveAttribute(
      "href",
      "/access-control/user-permissions/user-1",
    );
  });

  it("selecting multiple users switches to a combined bulk Roles+Direct Permissions grant, additive for both", async () => {
    const { services } = renderUserPermissionAssignment({ assignments: { "user:user-1": ["order:view"] } });
    const rowA = await rowFor("John Doe");
    const rowB = await rowFor("Jane Doe");

    fireEvent.click(within(rowA).getByRole("checkbox"));
    fireEvent.click(within(rowB).getByRole("checkbox"));

    expect(await screen.findByText("2 selected")).toBeInTheDocument();
    expect(screen.getByText("Update authorization for 2 users")).toBeInTheDocument();

    const applyButton = screen.getByRole("button", { name: "Apply" });
    expect(applyButton).toBeDisabled();

    // Check a role in the (default) Roles tab.
    const roleRow = (await screen.findByText("Order Manager")).closest("tr")!;
    fireEvent.click(within(roleRow).getByRole("checkbox"));
    expect(applyButton).toBeEnabled();

    // Check a direct permission too.
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Direct Permissions" }));
    fireEvent.click(await screen.findByRole("checkbox", { name: /Manage orders/ }));

    fireEvent.click(applyButton);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/grants 1 permission\(s\) and 1 role\(s\) to 2 user\(s\)/i)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Apply" }));

    await waitFor(async () => {
      // user-1 already had order:view — the grant must be additive, keeping it alongside the new order:manage.
      const userOne = await services.assignments.getAssignedPermissions("user", "user-1");
      expect(new Set(userOne.permissionIds)).toEqual(new Set(["order:view", "order:manage"]));
      const userOneRoles = await services.roleAssignments.getAssignedRoleIds("user", "user-1");
      expect(userOneRoles).toEqual(["role-1"]);
    });
    await waitFor(async () => {
      const userTwo = await services.assignments.getAssignedPermissions("user", "user-2");
      expect(userTwo.permissionIds).toEqual(["order:manage"]);
      const userTwoRoles = await services.roleAssignments.getAssignedRoleIds("user", "user-2");
      expect(userTwoRoles).toEqual(["role-1"]);
    });
    expect(await screen.findByText("Roles and permissions updated.")).toBeInTheDocument();
  });

  it("Clear selection returns to the prompt state", async () => {
    renderUserPermissionAssignment();
    const row = await rowFor("John Doe");
    fireEvent.click(within(row).getByRole("checkbox"));
    await screen.findByText("1 selected");

    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));

    expect(screen.queryByText("1 selected")).not.toBeInTheDocument();
    expect(screen.getByText("Select one or more users above to manage their authorization.")).toBeInTheDocument();
  });
});
