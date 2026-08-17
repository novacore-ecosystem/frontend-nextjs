import { describe, expect, it } from "vitest";
import {
  derivePermissionCategory,
  matchesPermissionSearch,
  resolvePermissionCatalog,
} from "../../src/components/access-control/permission-utils";
import type { PermissionDefinition, PermissionRecord } from "../../src/components/access-control/types";

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

describe("resolvePermissionCatalog", () => {
  const DICTIONARY: Record<string, string> = {
    "app.permissions.order.manage": "Manage orders",
    "app.permissions.order.view": "View orders",
    "app.permissions.inventory.view": "View inventory",
    "app.groups.order": "Orders",
  };
  const translate = (key: string) => DICTIONARY[key] ?? key;

  const definitions: PermissionDefinition[] = [
    { id: "order:manage", translationKey: "app.permissions.order.manage", group: "order", groupTranslationKey: "app.groups.order" },
    { id: "order:view", translationKey: "app.permissions.order.view", group: "order", groupTranslationKey: "app.groups.order" },
    { id: "inventory:view", translationKey: "app.permissions.inventory.view" },
  ];

  it("resolves each definition's translationKey via the translator", () => {
    const groups = resolvePermissionCatalog(definitions, translate);
    const orderGroup = groups.find((g) => g.category === "order");
    expect(orderGroup?.permissions.find((p) => p.id === "order:view")?.displayName).toBe("View orders");
  });

  it("groups by the explicit `group`, sorted by id within a group", () => {
    const groups = resolvePermissionCatalog(definitions, translate);
    const orderGroup = groups.find((g) => g.category === "order");
    expect(orderGroup?.permissions.map((p) => p.id)).toEqual(["order:manage", "order:view"]);
  });

  it("resolves the group label via groupTranslationKey", () => {
    const groups = resolvePermissionCatalog(definitions, translate);
    expect(groups.find((g) => g.category === "order")?.categoryLabel).toBe("Orders");
  });

  it("falls back to derivePermissionCategory(id) when `group` is omitted", () => {
    const groups = resolvePermissionCatalog(definitions, translate);
    expect(groups.map((g) => g.category).sort()).toEqual(["inventory", "order"]);
  });

  it("falls back to the raw group string when groupTranslationKey is omitted or unresolved", () => {
    const groups = resolvePermissionCatalog(definitions, translate);
    expect(groups.find((g) => g.category === "inventory")?.categoryLabel).toBe("inventory");
  });

  it("orders permissions by `order` before id, across groups collapsed into one", () => {
    const ordered: PermissionDefinition[] = [
      { id: "b:one", translationKey: "b:one", group: "same", order: 2 },
      { id: "a:two", translationKey: "a:two", group: "same", order: 1 },
      { id: "c:three", translationKey: "c:three", group: "same" },
    ];
    const groups = resolvePermissionCatalog(ordered, translate);
    expect(groups[0]!.permissions.map((p) => p.id)).toEqual(["a:two", "b:one", "c:three"]);
  });
});
