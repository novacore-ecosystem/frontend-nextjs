import { getPermissionCategoryTranslationKey, type Translator } from "@novacore/frontend-foundation";
import type { PermissionGroup, PermissionRecord } from "./types";

/** `id.split(":")[0]` — the same module-prefix convention `@novacore/frontend-foundation`'s `Permissions` catalog uses (`"order:view"` -> `"order"`). A reasonable default for adapters that don't have a richer grouping source. */
export function derivePermissionCategory(id: string): string {
  const separatorIndex = id.indexOf(":");
  return separatorIndex > 0 ? id.slice(0, separatorIndex) : id;
}

/** Category label via the foundation's category-translation fallback (`permissions.categories.<module>`), so an adapter never has to ship its own category copy. Falls back to the raw category string if the translator has no entry for it. */
export function translateCategoryLabel(category: string, t: Translator): string {
  const key = getPermissionCategoryTranslationKey(category);
  const label = t(key);
  return label === key ? category : label;
}

/** Groups a flat permission list by `category`, sorted by category label then by permission id — the shape `PermissionTree` renders. */
export function groupPermissions(records: PermissionRecord[], t: Translator): PermissionGroup[] {
  const byCategory = new Map<string, PermissionRecord[]>();
  for (const record of records) {
    const bucket = byCategory.get(record.category);
    if (bucket) bucket.push(record);
    else byCategory.set(record.category, [record]);
  }

  const groups: PermissionGroup[] = Array.from(byCategory.entries()).map(([category, permissions]) => ({
    category,
    categoryLabel: translateCategoryLabel(category, t),
    permissions: [...permissions].sort((a, b) => a.id.localeCompare(b.id)),
  }));

  return groups.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));
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
