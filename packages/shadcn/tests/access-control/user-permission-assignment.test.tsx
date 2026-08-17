import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { UserPermissionAssignment } from "../../src/components/access-control/user-permission-assignment";
import { createMockServices, createMockSubjectProvider, MOCK_PERMISSIONS } from "./mocks";
import type { SubjectOption } from "../../src/components/access-control/types";

const SEED_USERS: SubjectOption[] = [
  { id: "user-1", displayName: "John Doe", secondaryText: "john@example.com" },
  { id: "user-2", displayName: "Jane Doe", secondaryText: "jane@example.com" },
  { id: "user-3", displayName: "David Smith", secondaryText: "david@example.com" },
];

function renderUserPermissionAssignment(assignments: Record<string, string[]> = {}) {
  const services = createMockServices({ assignments });
  const subjectProvider = createMockSubjectProvider(SEED_USERS);
  render(
    <AccessControlProvider services={services}>
      <UserPermissionAssignment permissions={MOCK_PERMISSIONS} subjectProvider={subjectProvider} />
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
    expect(screen.getByText("Select one or more users above to assign permissions.")).toBeInTheDocument();
  });

  it("search filters the user list", async () => {
    renderUserPermissionAssignment();
    await screen.findByText("John Doe");

    fireEvent.change(screen.getByPlaceholderText("Search users…"), { target: { value: "David" } });

    await waitFor(() => expect(screen.queryByText("John Doe")).not.toBeInTheDocument());
    expect(screen.getByText("David Smith")).toBeInTheDocument();
  });

  it("selecting exactly one user shows the full PermissionAssignment editor, pre-checked with their current permissions", async () => {
    renderUserPermissionAssignment({ "user:user-1": ["order:view"] });
    const row = await rowFor("John Doe");

    fireEvent.click(within(row).getByRole("checkbox"));

    expect(await screen.findByText("1 selected")).toBeInTheDocument();
    expect(await screen.findByRole("checkbox", { name: /View orders/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Manage orders/ })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("selecting multiple users switches to the bulk grant flow, granting additively without a confirm-less save", async () => {
    const { services } = renderUserPermissionAssignment({ "user:user-1": ["order:view"] });
    const rowA = await rowFor("John Doe");
    const rowB = await rowFor("Jane Doe");

    fireEvent.click(within(rowA).getByRole("checkbox"));
    fireEvent.click(within(rowB).getByRole("checkbox"));

    expect(await screen.findByText("2 selected")).toBeInTheDocument();
    expect(screen.getByText("Grant permissions to 2 users")).toBeInTheDocument();

    const grantButton = screen.getByRole("button", { name: "Grant permissions" });
    expect(grantButton).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: /Manage orders/ }));
    expect(grantButton).toBeEnabled();

    fireEvent.click(grantButton);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/grants 1 permission\(s\) to 2 user\(s\)/i)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Grant permissions" }));

    await waitFor(async () => {
      // user-1 already had order:view — the grant must be additive, keeping it alongside the new order:manage.
      const userOne = await services.assignments.getAssignedPermissions("user", "user-1");
      expect(new Set(userOne.permissionIds)).toEqual(new Set(["order:view", "order:manage"]));
    });
    await waitFor(async () => {
      const userTwo = await services.assignments.getAssignedPermissions("user", "user-2");
      expect(userTwo.permissionIds).toEqual(["order:manage"]);
    });
    expect(await screen.findByText("Permissions granted.")).toBeInTheDocument();
  });

  it("Clear selection returns to the prompt state", async () => {
    renderUserPermissionAssignment();
    const row = await rowFor("John Doe");
    fireEvent.click(within(row).getByRole("checkbox"));
    await screen.findByText("1 selected");

    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));

    expect(screen.queryByText("1 selected")).not.toBeInTheDocument();
    expect(screen.getByText("Select one or more users above to assign permissions.")).toBeInTheDocument();
  });
});
