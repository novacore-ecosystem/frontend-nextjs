import type { TranslationBundle } from "@novacore/frontend-foundation";
import { en } from "./en";
import { vi } from "./vi";
import { zhCN } from "./zh-CN";

export { en, vi, zhCN };

/**
 * This package's own built-in translations, keyed by locale — the lowest-priority
 * ("fallback") layer in every `I18nProvider`'s translator (see `../i18n-provider.tsx`).
 * A consuming application's `translations`/`tenantTranslations` are checked first, so any
 * key here can be overridden without forking this package.
 */
export const BUILTIN_TRANSLATIONS: TranslationBundle = {
  en,
  vi,
  "zh-CN": zhCN,
};
