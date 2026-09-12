import { describe, expect, it } from "vitest";
import {
  derivePermissionCategory,
  matchesPermissionSearch,
  resolveNormalizedPermissionCatalog,
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

  it("defaults status to \"enabled\" when omitted", () => {
    const groups = resolvePermissionCatalog(definitions, translate);
    const record = groups.flatMap((g) => g.permissions).find((p) => p.id === "order:view");
    expect(record?.status).toBe("enabled");
    expect(record?.disabledReason).toBeUndefined();
  });

  it("excludes a \"hidden\" definition entirely, and its group when nothing else remains in it", () => {
    const withHidden: PermissionDefinition[] = [
      ...definitions,
      { id: "inventory:secret", translationKey: "app.permissions.inventory.secret", group: "inventory", status: "hidden" },
      { id: "billing:secret", translationKey: "app.permissions.billing.secret", group: "billing", status: "hidden" },
    ];
    const groups = resolvePermissionCatalog(withHidden, translate);
    const allIds = groups.flatMap((g) => g.permissions.map((p) => p.id));
    expect(allIds).not.toContain("inventory:secret");
    expect(allIds).not.toContain("billing:secret");
    // "billing" had only the hidden definition — the whole group must disappear, not render empty.
    expect(groups.find((g) => g.category === "billing")).toBeUndefined();
    // "inventory" still has its other, non-hidden definition.
    expect(groups.find((g) => g.category === "inventory")).toBeDefined();
  });

  it("resolves disabledReasonTranslationKey only for a \"disabled\" definition, falling back to undefined when unresolved", () => {
    const withDisabled: PermissionDefinition[] = [
      { id: "order:export", translationKey: "app.permissions.order.export", status: "disabled", disabledReasonTranslationKey: "app.reasons.exportComingSoon" },
      { id: "order:import", translationKey: "app.permissions.order.import", status: "disabled" },
    ];
    const dictionary: Record<string, string> = { "app.reasons.exportComingSoon": "Coming soon" };
    const groups = resolvePermissionCatalog(withDisabled, (key) => dictionary[key] ?? key);
    const records = groups.flatMap((g) => g.permissions);
    expect(records.find((p) => p.id === "order:export")).toMatchObject({ status: "disabled", disabledReason: "Coming soon" });
    // No dictionary entry for "order:import"'s (missing) key -> resolves to undefined, not the raw key.
    expect(records.find((p) => p.id === "order:import")).toMatchObject({ status: "disabled", disabledReason: undefined });
  });
});

describe("resolveNormalizedPermissionCatalog", () => {
  const DICTIONARY: Record<string, string> = {
    "app.permissions.order.view": "View orders",
    "app.permissions.order.manage": "Manage orders",
  };
  const translate = (key: string) => DICTIONARY[key] ?? key;
  const definitions: PermissionDefinition[] = [
    { id: "order:view", translationKey: "app.permissions.order.view", group: "order" },
    { id: "order:manage", translationKey: "app.permissions.order.manage", group: "order" },
  ];

  it("preserves the hierarchical PermissionGroup[] shape alongside a flat id -> PermissionRecord lookup", () => {
    const { groups, recordsById } = resolveNormalizedPermissionCatalog(definitions, translate);
    expect(groups.flatMap((g) => g.permissions.map((p) => p.id)).sort()).toEqual(["order:manage", "order:view"]);
    expect(recordsById.get("order:view")?.displayName).toBe("View orders");
    expect(recordsById.size).toBe(2);
  });

  it("returns the exact same object reference for the same (definitions, translator) pair — not recomputed", () => {
    const first = resolveNormalizedPermissionCatalog(definitions, translate);
    const second = resolveNormalizedPermissionCatalog(definitions, translate);
    expect(second).toBe(first);
    expect(second.groups).toBe(first.groups);
    expect(second.recordsById).toBe(first.recordsById);
  });

  it("recomputes for a different translator (e.g. a locale change), even with the same definitions reference", () => {
    const other = (key: string) => `other:${key}`;
    const first = resolveNormalizedPermissionCatalog(definitions, translate);
    const second = resolveNormalizedPermissionCatalog(definitions, other);
    expect(second).not.toBe(first);
    expect(second.recordsById.get("order:view")?.displayName).toBe("other:app.permissions.order.view");
  });

  it("recomputes for a different definitions array reference, even with identical content", () => {
    const clone = [...definitions];
    const first = resolveNormalizedPermissionCatalog(definitions, translate);
    const second = resolveNormalizedPermissionCatalog(clone, translate);
    expect(second).not.toBe(first);
    // Content is still equivalent -- only the cache identity differs, not correctness.
    expect(second.recordsById.get("order:view")?.displayName).toBe(first.recordsById.get("order:view")?.displayName);
  });
});
