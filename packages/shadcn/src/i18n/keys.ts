import type { DotPath } from "@novacore/frontend-foundation";
import type { en } from "./resources/en";

/**
 * Every translation key this package's own components resolve by default, e.g.
 * `"filter.addCondition"` or `"common.actions.apply"` — for autocomplete/typo-catching.
 * Not the type of `Translator`'s `key` parameter itself: a consuming application's own
 * `translations` dictionary legitimately adds keys beyond this baseline (business
 * vocabulary), so call sites stay typed as plain `string` (mirrors
 * `@novacore/frontend-foundation`'s own `TranslationKey`/`DotPath` pattern).
 */
export type BuiltinTranslationKey = DotPath<typeof en>;
