import { describe, expect, it } from "vitest";
import {
  derivePermissionCategory,
  groupPermissions,
  matchesPermissionSearch,
} from "../../src/components/access-control/permission-utils";
import type { PermissionRecord } from "../../src/components/access-control/types";

describe("derivePermissionCategory", () => {
  it("takes everything before the first colon", () => {
    expect(derivePermissionCategory("order:create-on-behalf")).toBe("order");
    expect(derivePermissionCategory("inventory:stock-move")).toBe("inventory");
  });

  it("falls back to the whole string when there's no colon", () => {
    expect(derivePermissionCategory("root")).toBe("root");
  });
});

describe("matchesPermissionSearch", () => {
  const record: PermissionRecord = {
    id: "order:view",
    category: "order",
    displayName: "View orders",
    description: "See order details",
  };

  it("matches on id, displayName, or description case-insensitively", () => {
    expect(matchesPermissionSearch(record, "ORDER:VIEW")).toBe(true);
    expect(matchesPermissionSearch(record, "view orders")).toBe(true);
    expect(matchesPermissionSearch(record, "details")).toBe(true);
  });

  it("returns false for a non-matching query", () => {
    expect(matchesPermissionSearch(record, "inventory")).toBe(false);
  });

  it("treats an empty/whitespace query as matching everything", () => {
    expect(matchesPermissionSearch(record, "")).toBe(true);
    expect(matchesPermissionSearch(record, "   ")).toBe(true);
  });
});

describe("groupPermissions", () => {
  const records: PermissionRecord[] = [
    { id: "order:manage", category: "order", displayName: "Manage orders" },
    { id: "order:view", category: "order", displayName: "View orders" },
    { id: "inventory:view", category: "inventory", displayName: "View inventory" },
  ];
  const translate = (key: string) => key;

  it("groups by category and sorts permissions within a group by id", () => {
    const groups = groupPermissions(records, translate);
    const orderGroup = groups.find((g) => g.category === "order");
    expect(orderGroup?.permissions.map((p) => p.id)).toEqual(["order:manage", "order:view"]);
  });

  it("produces one group per distinct category", () => {
    const groups = groupPermissions(records, translate);
    expect(groups.map((g) => g.category).sort()).toEqual(["inventory", "order"]);
  });
});
