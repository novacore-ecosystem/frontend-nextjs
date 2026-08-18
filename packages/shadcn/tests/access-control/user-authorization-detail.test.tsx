import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { UserAuthorizationDetail } from "../../src/components/access-control/user-authorization-detail";
import { createMockServices, createMockSubjectProvider, MOCK_PERMISSIONS } from "./mocks";
import type { RoleRecord, SubjectDetail } from "../../src/components/access-control/types";

const SEED_SUBJECTS: SubjectDetail[] = [
  {
    id: "user-1",
    displayName: "John Doe",
    secondaryText: "john@example.com",
    fields: [
      { label: "Status", value: "Active" },
      { label: "Department", value: "Sales" },
    ],
  },
];

const SEED_ROLES: RoleRecord[] = [{ id: "role-1", name: "Order Manager", permissionCount: 2 }];

function renderDetail(subjectId = "user-1") {
  const services = createMockServices({
    roles: SEED_ROLES,
    assignments: { "user:user-1": ["order:view"], "role:role-1": ["inventory:view"] },
    roleAssignments: { "user:user-1": ["role-1"] },
  });
  const subjectProvider = createMockSubjectProvider(SEED_SUBJECTS);
  render(
    <AccessControlProvider services={services}>
      <UserAuthorizationDetail subjectId={subjectId} permissions={MOCK_PERMISSIONS} subjectProvider={subjectProvider} />
    </AccessControlProvider>,
  );
}

describe("UserAuthorizationDetail", () => {
  it("renders the subject's header and Overview fields from the subject provider", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { name: "John Doe" })).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
  });

  it("Roles tab shows the subject's assigned roles", async () => {
    renderDetail();
    await screen.findByRole("heading", { name: "John Doe" });
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Roles" }));
    expect(await screen.findByText("Order Manager")).toBeInTheDocument();
  });

  it("Direct Permissions tab pre-checks the subject's current direct permissions", async () => {
    renderDetail();
    await screen.findByRole("heading", { name: "John Doe" });
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Direct Permissions" }));
    expect(await screen.findByRole("checkbox", { name: /View orders/ })).toBeChecked();
  });

  it("Effective Permissions tab shows the union of direct and role-derived permissions", async () => {
    renderDetail();
    await screen.findByRole("heading", { name: "John Doe" });
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Effective Permissions" }));
    expect(await screen.findByText("View orders")).toBeInTheDocument();
    expect(screen.getByText("Direct")).toBeInTheDocument();
    expect(await screen.findByText("View inventory")).toBeInTheDocument();
    expect(screen.getByText("Role — Order Manager")).toBeInTheDocument();
  });

  it("shows the not-found state when the subject provider returns null", async () => {
    renderDetail("missing-user");
    expect(await screen.findByText("This user could not be found.")).toBeInTheDocument();
  });
});
