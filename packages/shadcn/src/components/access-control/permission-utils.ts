import type { Translator } from "@novacore/frontend-foundation";
import type { PermissionDefinition, PermissionGroup, PermissionRecord } from "./types";

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
