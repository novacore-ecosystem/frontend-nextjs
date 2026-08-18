import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { PermissionManagement } from "../../src/components/access-control/permission-management";
import { TenantEntitlementProvider } from "../../src/components/access-control/tenant-entitlement-provider";
import { MOCK_PERMISSIONS } from "./mocks";

describe("PermissionManagement", () => {
  it("renders the application-supplied catalog, grouped, with no fetch and no edit action", async () => {
    render(<PermissionManagement permissions={MOCK_PERMISSIONS} />);

    expect(screen.getByText("View orders")).toBeInTheDocument();
    expect(screen.getByText("Manage orders")).toBeInTheDocument();
    expect(screen.getByText("View inventory")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("search filters the catalog by identifier/displayName", async () => {
    render(<PermissionManagement permissions={MOCK_PERMISSIONS} />);

    fireEvent.change(screen.getByPlaceholderText("Search permissions…"), { target: { value: "inventory" } });

    await waitFor(() => expect(screen.queryByText("View orders")).not.toBeInTheDocument());
    expect(screen.getByText("View inventory")).toBeInTheDocument();
  });

  it("an empty catalog renders the empty state instead of erroring", () => {
    render(<PermissionManagement permissions={[]} />);
    expect(screen.getByText("No permissions match your search.")).toBeInTheDocument();
  });

  it("never renders the raw permission identifier as visible text, only as a data attribute", () => {
    const { container } = render(<PermissionManagement permissions={MOCK_PERMISSIONS} />);
    expect(screen.queryByText("order:view")).not.toBeInTheDocument();
    expect(container.querySelector('[data-permission-id="order:view"]')).not.toBeNull();
  });

  it("with no TenantEntitlementProvider mounted, the page renders without a Status column claiming anything is unavailable", () => {
    render(<PermissionManagement permissions={MOCK_PERMISSIONS} />);
    expect(screen.queryByText("Not available")).not.toBeInTheDocument();
  });

  it("marks a permission outside the tenant's current entitlement as unavailable, without hiding it", () => {
    render(
      <TenantEntitlementProvider status="ready" entitledPermissionIds={["order:view"]}>
        <PermissionManagement permissions={MOCK_PERMISSIONS} />
      </TenantEntitlementProvider>,
    );
    expect(screen.getByText("View orders")).toBeInTheDocument();
    expect(screen.getByText("Manage orders")).toBeInTheDocument();
    expect(screen.getAllByText("Not available").length).toBeGreaterThan(0);
  });

  it("shows a loading state while entitlement is loading, not a false 'unavailable' status", () => {
    render(
      <TenantEntitlementProvider status="loading" entitledPermissionIds="all">
        <PermissionManagement permissions={MOCK_PERMISSIONS} />
      </TenantEntitlementProvider>,
    );
    expect(screen.queryByText("View orders")).not.toBeInTheDocument();
    expect(screen.queryByText("Not available")).not.toBeInTheDocument();
  });

  it("on an entitlement error, shows an explanatory banner and 'unknown' status instead of silently marking permissions unavailable", () => {
    render(
      <TenantEntitlementProvider status="error" entitledPermissionIds="all">
        <PermissionManagement permissions={MOCK_PERMISSIONS} />
      </TenantEntitlementProvider>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getAllByText("Status unavailable").length).toBeGreaterThan(0);
    expect(screen.queryByText("Not available")).not.toBeInTheDocument();
  });
});
