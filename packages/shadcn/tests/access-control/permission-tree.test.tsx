import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { PermissionTree } from "../../src/components/access-control/permission-tree";
import { MOCK_PERMISSION_GROUPS } from "./mocks";

function Controlled({
  onSelectedIdsChange,
  selectedIds = [],
  inheritedIds,
  readOnlyIds,
  unavailableIds,
  disabled,
}: {
  onSelectedIdsChange: (ids: string[]) => void;
  selectedIds?: string[];
  inheritedIds?: string[];
  readOnlyIds?: string[];
  unavailableIds?: string[];
  disabled?: boolean;
}) {
  const [ids, setIds] = React.useState(selectedIds);
  return (
    <PermissionTree
      groups={MOCK_PERMISSION_GROUPS}
      selectedIds={ids}
      onSelectedIdsChange={(next) => {
        setIds(next);
        onSelectedIdsChange(next);
      }}
      inheritedIds={inheritedIds}
      readOnlyIds={readOnlyIds}
      unavailableIds={unavailableIds}
      disabled={disabled}
    />
  );
}

describe("PermissionTree selection", () => {
  it("toggles a single permission on then off", () => {
    const onChange = vi.fn();
    render(<Controlled onSelectedIdsChange={onChange} />);

    const checkbox = screen.getByRole("checkbox", { name: /View orders/ });
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(["order:view"]);

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("select all checks every permission across every group", () => {
    const onChange = vi.fn();
    render(<Controlled onSelectedIdsChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Select all" }));
    const allIds = MOCK_PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.id));
    expect(new Set(onChange.mock.calls.at(-1)?.[0])).toEqual(new Set(allIds));
  });

  it("deselect all clears every selected permission", () => {
    const onChange = vi.fn();
    render(<Controlled onSelectedIdsChange={onChange} selectedIds={["order:view", "order:manage"]} />);

    fireEvent.click(screen.getByRole("button", { name: "Deselect all" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("toggling a group header checks/unchecks every permission in that group only", () => {
    const onChange = vi.fn();
    render(<Controlled onSelectedIdsChange={onChange} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Orders" }));
    expect(new Set(onChange.mock.calls.at(-1)?.[0])).toEqual(new Set(["order:view", "order:manage"]));
  });

  it("inherited permissions render checked and cannot be toggled off", () => {
    const onChange = vi.fn();
    render(<Controlled onSelectedIdsChange={onChange} inheritedIds={["order:view"]} />);

    const checkbox = screen.getByRole("checkbox", { name: /View orders/ });
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("read-only permissions cannot be toggled and select-all skips them", () => {
    const onChange = vi.fn();
    render(<Controlled onSelectedIdsChange={onChange} readOnlyIds={["inventory:adjust"]} />);

    expect(screen.getByRole("checkbox", { name: /Adjust inventory/ })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Select all" }));
    const selected = new Set(onChange.mock.calls.at(-1)?.[0] as string[]);
    expect(selected.has("inventory:adjust")).toBe(false);
    expect(selected.has("inventory:view")).toBe(true);
  });

  it("an existing assignment to an unavailable permission stays checked and can be unchecked (removed)", () => {
    const onChange = vi.fn();
    render(
      <Controlled onSelectedIdsChange={onChange} selectedIds={["order:view"]} unavailableIds={["order:view"]} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: /View orders/ });
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeEnabled();

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("an unavailable permission with no existing assignment cannot be newly checked", () => {
    const onChange = vi.fn();
    render(<Controlled onSelectedIdsChange={onChange} unavailableIds={["order:view"]} />);

    const checkbox = screen.getByRole("checkbox", { name: /View orders/ });
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeDisabled();

    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("select all skips unavailable permissions that aren't already assigned, but keeps ones that are", () => {
    const onChange = vi.fn();
    render(
      <Controlled onSelectedIdsChange={onChange} selectedIds={["order:view"]} unavailableIds={["order:view", "inventory:adjust"]} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Select all" }));
    const selected = new Set(onChange.mock.calls.at(-1)?.[0] as string[]);
    expect(selected.has("order:view")).toBe(true);
    expect(selected.has("inventory:adjust")).toBe(false);
    expect(selected.has("inventory:view")).toBe(true);
  });

  it("disabled mode locks every checkbox and hides select-all/deselect-all", () => {
    render(<Controlled onSelectedIdsChange={() => {}} selectedIds={["order:view"]} disabled />);

    expect(screen.getByRole("checkbox", { name: /View orders/ })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Select all" })).not.toBeInTheDocument();
  });

  it("the search box filters permissions across groups, hiding non-matching groups entirely", () => {
    render(<Controlled onSelectedIdsChange={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Search permissions…"), { target: { value: "inventory" } });

    expect(screen.queryByText("Orders")).not.toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
  });

  it("shows the empty state when the search matches nothing", () => {
    render(<Controlled onSelectedIdsChange={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Search permissions…"), { target: { value: "nonexistent" } });

    expect(screen.getByText("No permissions match your search.")).toBeInTheDocument();
  });
});
