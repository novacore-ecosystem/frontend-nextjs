import type { Translator } from "@novacore/frontend-foundation";
import type { PermissionDefinition, PermissionGroup, PermissionRecord, TenantEntitlementState } from "./types";

/** `id.split(":")[0]` — the same module-prefix convention `@novacore/frontend-foundation`'s `Permissions` catalog uses (`"order:view"` -> `"order"`). The default `PermissionDefinition.group` when the application doesn't supply one. */
export function derivePermissionCategory(id: string): string {
  const separatorIndex = id.indexOf(":");
  return separatorIndex > 0 ? id.slice(0, separatorIndex) : id;
}

/** Resolves a translation key via `t`, falling back to `fallback` when the key itself comes back unresolved (the translator's `onMissingKey: "key"` default). */
function resolveOrFallback(key: string | undefined, fallback: string, t: Translator): string {
  if (!key) return fallback;
  const resolved = t(key);
  return resolved === key ? fallback : resolved;
}

/** Same as {@link resolveOrFallback} but returns `undefined` instead of a fallback string — for genuinely optional copy like `descriptionTranslationKey`. */
function resolveOptional(key: string | undefined, t: Translator): string | undefined {
  if (!key) return undefined;
  const resolved = t(key);
  return resolved === key ? undefined : resolved;
}

/**
 * Turns the consuming application's static `PermissionDefinition[]` catalog into the
 * render-ready `PermissionGroup[]` shape `PermissionTree`/`PermissionManagement` consume —
 * resolving each definition's `translationKey`/`groupTranslationKey` via the active
 * `I18nProvider`'s translator and grouping/sorting the result. This is the one place a
 * `PermissionDefinition[]` becomes UI-facing data; every access-control component that takes a
 * `permissions` prop calls this internally, so an application never has to.
 */
export function resolvePermissionCatalog(definitions: PermissionDefinition[], t: Translator): PermissionGroup[] {
  const sorted = [...definitions].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderA !== orderB ? orderA - orderB : a.id.localeCompare(b.id);
  });

  const byGroup = new Map<string, { label: string; permissions: PermissionRecord[] }>();
  for (const definition of sorted) {
    const group = definition.group ?? derivePermissionCategory(definition.id);
    const record: PermissionRecord = {
      id: definition.id,
      category: group,
      displayName: t(definition.translationKey),
      description: resolveOptional(definition.descriptionTranslationKey, t),
    };
    const bucket = byGroup.get(group);
    if (bucket) bucket.permissions.push(record);
    else byGroup.set(group, { label: resolveOrFallback(definition.groupTranslationKey, group, t), permissions: [record] });
  }

  return [...byGroup.entries()]
    .map(([category, { label, permissions }]) => ({ category, categoryLabel: label, permissions }))
    .sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));
}

/**
 * Which of `catalogIds` the tenant does NOT currently own, per `entitlement`. `[]` unless
 * entitlement is `"ready"` and gating is actually configured (`entitledPermissionIds !== "all"`) —
 * while loading or on error, nothing is treated as unavailable (fail-open; the caller should show
 * a loading/error state of its own rather than relying on this to signal it).
 */
export function deriveUnavailablePermissionIds(catalogIds: string[], entitlement: TenantEntitlementState): string[] {
  if (entitlement.status !== "ready" || entitlement.entitledPermissionIds === "all") return [];
  const entitled = new Set(entitlement.entitledPermissionIds);
  return catalogIds.filter((id) => !entitled.has(id));
}

/**
 * Annotates already-resolved `PermissionRecord`s with `entitled`, given the tenant's current
 * entitlement — a separate step from `resolvePermissionCatalog` so that function stays a pure
 * translation-only concern with no entitlement fixture needed in its own tests. `"unknown"` when
 * entitlement failed to load (never silently mapped to "not entitled"); every record is `entitled:
 * true` when no gating is configured (`"all"`); unchanged (no `entitled` field) while loading —
 * callers should render a loading state instead of this data during that window.
 */
export function annotateEntitlement(records: PermissionRecord[], entitlement: TenantEntitlementState): PermissionRecord[] {
  if (entitlement.status === "error") return records.map((record) => ({ ...record, entitled: "unknown" as const }));
  if (entitlement.status === "loading") return records;
  if (entitlement.entitledPermissionIds === "all") return records.map((record) => ({ ...record, entitled: true as const }));
  const entitled = new Set(entitlement.entitledPermissionIds);
  return records.map((record) => ({ ...record, entitled: entitled.has(record.id) }));
}

/** Case-insensitive match against a permission's id/displayName/description — the filter `PermissionTree`'s search box applies. */
export function matchesPermissionSearch(record: PermissionRecord, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    record.id.toLowerCase().includes(needle) ||
    record.displayName.toLowerCase().includes(needle) ||
    (record.description?.toLowerCase().includes(needle) ?? false)
  );
}
