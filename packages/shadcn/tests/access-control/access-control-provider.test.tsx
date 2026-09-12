import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { PermissionAssignment } from "../../src/components/access-control/permission-assignment";
import { RoleManagement } from "../../src/components/access-control/role-management";
import { createMockServices, MOCK_PERMISSIONS } from "./mocks";

describe("AccessControlProvider partial services", () => {
  it("lets a permission-assignment-only consumer (e.g. a Root app granting a tenant's entitlement) mount without Role/Position/RoleAssignment services", async () => {
    const { assignments } = createMockServices({ assignments: { "tenant:tenant-1": ["order:view"] } });

    render(
      <AccessControlProvider services={{ assignments }}>
        <PermissionAssignment permissions={MOCK_PERMISSIONS} subjectType="tenant" subjectId="tenant-1" />
      </AccessControlProvider>,
    );

    expect(await screen.findByRole("checkbox", { name: /View orders/ })).toBeChecked();
  });

  it("throws a clear, service-named error when a component's required service was never provided", () => {
    const { assignments } = createMockServices();
    // Suppress React's noisy console.error for the expected render-time throw.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <AccessControlProvider services={{ assignments }}>
          <RoleManagement permissions={MOCK_PERMISSIONS} />
        </AccessControlProvider>,
      ),
    ).toThrow(/missing the "roles" service/);

    consoleError.mockRestore();
  });
});
