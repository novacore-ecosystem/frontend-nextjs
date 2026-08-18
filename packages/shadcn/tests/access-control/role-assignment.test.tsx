import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { RoleAssignment } from "../../src/components/access-control/role-assignment";
import { createMockServices } from "./mocks";
import type { RoleRecord } from "../../src/components/access-control/types";

const SEED_ROLES: RoleRecord[] = [
  { id: "role-1", name: "Order Manager", description: "Manages orders", permissionCount: 4 },
  { id: "role-2", name: "Shipping Manager", description: "Manages shipments", permissionCount: 2 },
];

function renderRoleAssignment(roleAssignments: Record<string, string[]> = {}) {
  const services = createMockServices({ roles: SEED_ROLES, roleAssignments });
  return {
    services,
    ...render(
      <AccessControlProvider services={services}>
        <RoleAssignment subjectType="position" subjectId="pos-1" />
      </AccessControlProvider>,
    ),
  };
}

describe("RoleAssignment", () => {
  it("lists roles and pre-checks the subject's currently assigned ones", async () => {
    renderRoleAssignment({ "position:pos-1": ["role-1"] });
    const row1 = (await screen.findByText("Order Manager")).closest("tr")!;
    const row2 = (await screen.findByText("Shipping Manager")).closest("tr")!;

    expect(within(row1).getByRole("checkbox")).toBeChecked();
    expect(within(row2).getByRole("checkbox")).not.toBeChecked();
  });

  it("search filters the role list", async () => {
    renderRoleAssignment();
    await screen.findByText("Order Manager");

    fireEvent.change(screen.getByPlaceholderText("Search roles…"), { target: { value: "Shipping" } });

    await waitFor(() => expect(screen.queryByText("Order Manager")).not.toBeInTheDocument());
    expect(screen.getByText("Shipping Manager")).toBeInTheDocument();
  });

  it("Save persists the draft through the role-assignment service", async () => {
    const { services } = renderRoleAssignment();
    const row = (await screen.findByText("Shipping Manager")).closest("tr")!;

    fireEvent.click(within(row).getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(async () => {
      const assigned = await services.roleAssignments.getAssignedRoleIds("position", "pos-1");
      expect(assigned).toEqual(["role-2"]);
    });
  });

  it("readOnly hides Save/Cancel", async () => {
    const services = createMockServices({ roles: SEED_ROLES });
    render(
      <AccessControlProvider services={services}>
        <RoleAssignment subjectType="position" subjectId="pos-1" readOnly />
      </AccessControlProvider>,
    );
    await screen.findByText("Order Manager");
    expect(screen.queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument();
  });
});
