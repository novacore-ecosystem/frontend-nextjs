import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { RoleEditorPage } from "../../src/components/access-control/role-editor-page";
import { createMockServices, MOCK_PERMISSIONS } from "./mocks";
import type { RoleRecord } from "../../src/components/access-control/types";

const SEED_ROLES: RoleRecord[] = [{ id: "role-1", name: "Warehouse Manager", description: "Runs warehouse ops", permissionCount: 1 }];

describe("RoleEditorPage", () => {
  it("create mode: shows the create title, no permission picker, and a hint instead", async () => {
    const services = createMockServices({ roles: SEED_ROLES });
    const onBack = vi.fn();
    const onSaved = vi.fn();
    render(
      <AccessControlProvider services={services}>
        <RoleEditorPage permissions={MOCK_PERMISSIONS} onBack={onBack} onSaved={onSaved} />
      </AccessControlProvider>,
    );

    expect(await screen.findByText("Save the role first to assign its permissions.")).toBeInTheDocument();
    expect(screen.queryByText(/Select all/)).not.toBeInTheDocument();
  });

  it("create mode: Save creates the role and calls onSaved with the result", async () => {
    const services = createMockServices({ roles: SEED_ROLES });
    const onSaved = vi.fn();
    render(
      <AccessControlProvider services={services}>
        <RoleEditorPage permissions={MOCK_PERMISSIONS} onBack={() => {}} onSaved={onSaved} />
      </AccessControlProvider>,
    );

    fireEvent.change(await screen.findByLabelText(/^Name/), { target: { value: "Auditor" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Save" })[0]);

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(expect.objectContaining({ name: "Auditor" })));
  });

  it("edit mode: loads the role, pre-fills the fields, and shows the permission picker", async () => {
    const services = createMockServices({ roles: SEED_ROLES, assignments: { "role:role-1": ["order:view"] } });
    render(
      <AccessControlProvider services={services}>
        <RoleEditorPage roleId="role-1" permissions={MOCK_PERMISSIONS} onBack={() => {}} />
      </AccessControlProvider>,
    );

    expect(await screen.findByDisplayValue("Warehouse Manager")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Runs warehouse ops")).toBeInTheDocument();
    expect(await screen.findByText("Select all")).toBeInTheDocument();
  });

  it("edit mode: shows a not-found state with a back action when the role doesn't exist", async () => {
    const services = createMockServices({ roles: SEED_ROLES });
    const onBack = vi.fn();
    render(
      <AccessControlProvider services={services}>
        <RoleEditorPage roleId="missing" permissions={MOCK_PERMISSIONS} onBack={onBack} />
      </AccessControlProvider>,
    );

    expect(await screen.findByText("This role could not be found.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Back to roles" }));
    expect(onBack).toHaveBeenCalled();
  });

  it("does not show a 'View change history' button when the auditLogs service isn't provided", async () => {
    const services = createMockServices({ roles: SEED_ROLES });
    render(
      <AccessControlProvider services={services}>
        <RoleEditorPage roleId="role-1" permissions={MOCK_PERMISSIONS} onBack={() => {}} />
      </AccessControlProvider>,
    );

    await screen.findByDisplayValue("Warehouse Manager");
    expect(screen.queryByRole("button", { name: "View change history" })).not.toBeInTheDocument();
  });
});
