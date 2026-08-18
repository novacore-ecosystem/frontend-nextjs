import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AccessControlProvider } from "../../src/components/access-control/access-control-provider";
import { EffectivePermissions } from "../../src/components/access-control/effective-permissions";
import { TenantEntitlementProvider } from "../../src/components/access-control/tenant-entitlement-provider";
import { createMockServices, MOCK_PERMISSIONS } from "./mocks";
import type { RoleRecord } from "../../src/components/access-control/types";

const SEED_ROLES: RoleRecord[] = [{ id: "role-1", name: "Order Manager" }];

describe("EffectivePermissions", () => {
  it("merges direct permissions with permissions inherited from assigned roles, tagging each source", async () => {
    const services = createMockServices({
      roles: SEED_ROLES,
      assignments: {
        "user:user-1": ["inventory:view"],
        "role:role-1": ["order:view", "order:manage"],
      },
      roleAssignments: { "user:user-1": ["role-1"] },
    });

    render(
      <AccessControlProvider services={services}>
        <EffectivePermissions permissions={MOCK_PERMISSIONS} subjectType="user" subjectId="user-1" />
      </AccessControlProvider>,
    );

    expect(await screen.findByText("View inventory")).toBeInTheDocument();
    expect(await screen.findByText("Direct")).toBeInTheDocument();
    expect(await screen.findByText("View orders")).toBeInTheDocument();
    expect(await screen.findByText("Manage orders")).toBeInTheDocument();
    expect(screen.getAllByText("Role — Order Manager").length).toBe(2);
    // Not granted anywhere — shouldn't appear at all.
    expect(screen.queryByText("Adjust inventory")).not.toBeInTheDocument();
  });

  it("separates an assigned-but-unavailable permission into its own section instead of hiding it", async () => {
    const services = createMockServices({
      roles: SEED_ROLES,
      assignments: { "user:user-1": ["order:view", "order:manage"] },
    });

    render(
      <AccessControlProvider services={services}>
        <TenantEntitlementProvider status="ready" entitledPermissionIds={["order:view"]}>
          <EffectivePermissions permissions={MOCK_PERMISSIONS} subjectType="user" subjectId="user-1" />
        </TenantEntitlementProvider>
      </AccessControlProvider>,
    );

    expect(await screen.findByText("View orders")).toBeInTheDocument();
    expect(await screen.findByText("Manage orders")).toBeInTheDocument();
    expect(screen.getByText("Currently unavailable")).toBeInTheDocument();
  });

  it("shows the empty state when the subject has no effective permissions", async () => {
    const services = createMockServices({ roles: SEED_ROLES });
    render(
      <AccessControlProvider services={services}>
        <EffectivePermissions permissions={MOCK_PERMISSIONS} subjectType="user" subjectId="user-2" />
      </AccessControlProvider>,
    );
    expect(await screen.findByText("This user has no effective permissions yet.")).toBeInTheDocument();
  });
});
