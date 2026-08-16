"use client";

import * as React from "react";
import {
  createTranslator,
  DEFAULT_LOCALE,
  getSupportedLocales,
  type Locale,
  type LocaleMetadata,
  type MissingKeyStrategy,
  type TranslationBundle,
  type Translator,
} from "@novacore/frontend-foundation";
import { BUILTIN_TRANSLATIONS } from "./resources";

export interface I18nProviderProps {
  children: React.ReactNode;
  /** Controlled active locale. Omit to let the provider manage its own state internally (see `defaultLocale`) — same optional-controlled-state pattern as `AdminLayout`'s `collapsed`/`onCollapsedChange`. */
  locale?: Locale;
  /** Called on every locale change (including uncontrolled changes triggered by `setLocale`/`LocaleSwitcher`) — wire this to persist the choice (e.g. via `usePersistentState`). */
  onLocaleChange?: (locale: Locale) => void;
  /** Initial locale when uncontrolled. Defaults to the platform default locale. */
  defaultLocale?: Locale;
  /** The consuming application's own dictionary — business/domain vocabulary, and optionally overrides of a built-in key (e.g. `filter.apply`). Checked before this package's built-in translations. */
  translations?: TranslationBundle;
  /**
   * Highest-priority runtime overrides, e.g. tenant-specific wording. This provider has no
   * concept of what a "tenant" is or where these come from — it's just one more dictionary
   * layer above `translations`. Fetching/merging tenant-specific data is the consuming
   * application's responsibility.
   */
  tenantTranslations?: TranslationBundle;
  /** Locale retried when a key is missing for the active locale. Defaults to the platform default locale. */
  fallbackLocale?: Locale;
  /** Missing-key behavior, forwarded to `createTranslator`. Defaults to `"key"` (return the key itself — visible but non-fatal). */
  onMissingKey?: MissingKeyStrategy;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translator;
  /** Every supported locale's metadata, in canonical order — ready for a locale selector. */
  locales: readonly LocaleMetadata[];
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

const DEFAULT_TRANSLATOR = createTranslator(
  { fallback: BUILTIN_TRANSLATIONS },
  { locale: DEFAULT_LOCALE, fallbackLocale: DEFAULT_LOCALE },
);

function warnNoProvider() {
  console.warn(
    "[@novacore/frontend-next-shadcn] setLocale() called with no <I18nProvider> mounted — locale switching has no effect. Wrap your app in <I18nProvider> to enable it.",
  );
}

/** Used by `useTranslation()`/`useI18nContext()` when no `<I18nProvider>` is mounted, so every component keeps working (English, built-in translations only) with zero setup — mirrors `usePermission()`'s permissive default when no `<PermissionProvider>` is mounted. */
const DEFAULT_CONTEXT_VALUE: I18nContextValue = {
  locale: DEFAULT_LOCALE,
  setLocale: warnNoProvider,
  t: DEFAULT_TRANSLATOR,
  locales: getSupportedLocales(),
};

/**
 * Merges this package's built-in component translations with a consuming application's own
 * dictionary (and optional tenant-level overrides) into one reactive translator, and exposes
 * the active locale + a setter for `LocaleSwitcher`/persistence. Precedence per key:
 * tenant override -> application translation -> this package's built-in default -> `fallbackLocale`.
 *
 * A sibling of `AdminProvider`/`PermissionProvider`, not a replacement for either — mount
 * alongside them:
 * ```tsx
 * <AdminProvider theme={...}>
 *   <I18nProvider locale={locale} onLocaleChange={setLocale} translations={appTranslations}>
 *     {children}
 *   </I18nProvider>
 * </AdminProvider>
 * ```
 */
export function I18nProvider({
  children,
  locale: controlledLocale,
  onLocaleChange,
  defaultLocale = DEFAULT_LOCALE,
  translations,
  tenantTranslations,
  fallbackLocale = DEFAULT_LOCALE,
  onMissingKey = "key",
}: I18nProviderProps) {
  const [internalLocale, setInternalLocale] = React.useState<Locale>(defaultLocale);
  const locale = controlledLocale ?? internalLocale;

  const setLocale = React.useCallback(
    (next: Locale) => {
      if (controlledLocale === undefined) setInternalLocale(next);
      onLocaleChange?.(next);
    },
    [controlledLocale, onLocaleChange],
  );

  const t = React.useMemo(
    () =>
      createTranslator(
        { tenant: tenantTranslations, application: translations, fallback: BUILTIN_TRANSLATIONS },
        { locale, fallbackLocale, onMissingKey },
      ),
    [locale, translations, tenantTranslations, fallbackLocale, onMissingKey],
  );

  const value = React.useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, locales: getSupportedLocales() }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Raw context access. Returns a permissive built-in-only default when no `<I18nProvider>` is mounted — never `null`, so callers never need a guard. */
export function useI18nContext(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  return ctx ?? DEFAULT_CONTEXT_VALUE;
}

/** Primary hook for components: `const { t, locale, setLocale } = useTranslation();`. Works with zero setup — falls back to this package's built-in English dictionary when no `<I18nProvider>` is mounted. */
export function useTranslation(): I18nContextValue {
  return useI18nContext();
}
