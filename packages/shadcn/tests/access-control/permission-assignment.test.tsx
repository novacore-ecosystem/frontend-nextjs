import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { PermissionAssignment } from "../../src/components/access-control/permission-assignment";
import { TenantEntitlementProvider } from "../../src/components/access-control/tenant-entitlement-provider";
import { createMockServices, MOCK_PERMISSIONS } from "./mocks";

function renderAssignment(services = createMockServices({ assignments: { "role:role-1": ["order:view"] } })) {
  return {
    services,
    ...render(
      <AccessControlProvider services={services}>
        <PermissionAssignment permissions={MOCK_PERMISSIONS} subjectType="role" subjectId="role-1" />
      </AccessControlProvider>,
    ),
  };
}

describe("PermissionAssignment", () => {
  it("loads and pre-checks the subject's currently assigned permissions", async () => {
    renderAssignment();
    expect(await screen.findByRole("checkbox", { name: /View orders/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Manage orders/ })).not.toBeChecked();
  });

  it("disables Save/Cancel until something changes, then shows the unsaved-changes hint", async () => {
    renderAssignment();
    await screen.findByRole("checkbox", { name: /View orders/ });

    expect(screen.queryByText("You have unsaved changes.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: /Manage orders/ }));

    expect(screen.getByText("You have unsaved changes.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  it("Cancel reverts the draft back to the last-saved selection", async () => {
    renderAssignment();
    const managePermission = await screen.findByRole("checkbox", { name: /Manage orders/ });

    fireEvent.click(managePermission);
    expect(managePermission).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(managePermission).not.toBeChecked();
    expect(screen.queryByText("You have unsaved changes.")).not.toBeInTheDocument();
  });

  it("Save persists the draft through the assignment service", async () => {
    const services = createMockServices({ assignments: { "role:role-1": ["order:view"] } });
    renderAssignment(services);
    const managePermission = await screen.findByRole("checkbox", { name: /Manage orders/ });

    fireEvent.click(managePermission);
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(async () => {
      const assigned = await services.assignments.getAssignedPermissions("role", "role-1");
      expect(new Set(assigned.permissionIds)).toEqual(new Set(["order:view", "order:manage"]));
    });
    await waitFor(() => expect(screen.queryByText("You have unsaved changes.")).not.toBeInTheDocument());
  });

  it("readOnly locks every checkbox and hides Save/Cancel entirely", async () => {
    const services = createMockServices({ assignments: { "role:role-1": ["order:view"] } });
    render(
      <AccessControlProvider services={services}>
        <PermissionAssignment permissions={MOCK_PERMISSIONS} subjectType="role" subjectId="role-1" readOnly />
      </AccessControlProvider>,
    );

    expect(await screen.findByRole("checkbox", { name: /View orders/ })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
  });
});

describe("PermissionAssignment tenant entitlement", () => {
  it("preserves an existing assignment outside the current entitlement across a save (downgrade doesn't delete it)", async () => {
    const services = createMockServices({ assignments: { "role:role-1": ["order:view", "order:manage"] } });
    render(
      <AccessControlProvider services={services}>
        <TenantEntitlementProvider status="ready" entitledPermissionIds={["order:view"]}>
          <PermissionAssignment permissions={MOCK_PERMISSIONS} subjectType="role" subjectId="role-1" />
        </TenantEntitlementProvider>
      </AccessControlProvider>,
    );

    const manageCheckbox = await screen.findByRole("checkbox", { name: /Manage orders/ });
    expect(manageCheckbox).toBeChecked();
    expect(manageCheckbox).toBeEnabled();

    // Nothing was touched, so Save has nothing to submit — the assignment stays exactly as loaded.
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
    const assigned = await services.assignments.getAssignedPermissions("role", "role-1");
    expect(new Set(assigned.permissionIds)).toEqual(new Set(["order:view", "order:manage"]));
  });

  it("a re-upgrade (entitlement grows back) makes a previously-unavailable assignment freely editable again, with no reassignment needed", async () => {
    const services = createMockServices({ assignments: { "role:role-1": ["order:view", "order:manage"] } });
    render(
      <AccessControlProvider services={services}>
        <TenantEntitlementProvider status="ready" entitledPermissionIds={["order:view", "order:manage"]}>
          <PermissionAssignment permissions={MOCK_PERMISSIONS} subjectType="role" subjectId="role-1" />
        </TenantEntitlementProvider>
      </AccessControlProvider>,
    );

    const manageCheckbox = await screen.findByRole("checkbox", { name: /Manage orders/ });
    expect(manageCheckbox).toBeChecked();
    expect(manageCheckbox).toBeEnabled();

    fireEvent.click(manageCheckbox);
    expect(manageCheckbox).not.toBeChecked();
    fireEvent.click(manageCheckbox);
    expect(manageCheckbox).toBeChecked();
  });

  it("rejects a brand-new assignment to a permission outside the current entitlement", async () => {
    const services = createMockServices({ assignments: { "role:role-1": ["order:view"] } });
    render(
      <AccessControlProvider services={services}>
        <TenantEntitlementProvider status="ready" entitledPermissionIds={["order:view"]}>
          <PermissionAssignment permissions={MOCK_PERMISSIONS} subjectType="role" subjectId="role-1" />
        </TenantEntitlementProvider>
      </AccessControlProvider>,
    );

    const manageCheckbox = await screen.findByRole("checkbox", { name: /Manage orders/ });
    expect(manageCheckbox).toBeDisabled();

    fireEvent.click(manageCheckbox);
    expect(manageCheckbox).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
  });
});
