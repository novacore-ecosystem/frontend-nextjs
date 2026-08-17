import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { PermissionManagement } from "../../src/components/access-control/permission-management";
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
});
