"use client";

import { Check, Languages } from "lucide-react";
import * as React from "react";
import { isSupportedLocale } from "@novacore/frontend-foundation";
import { useTranslation } from "../../i18n";
import { cn } from "../../lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface LocaleOption {
  code: string;
  label: string;
}

export interface LocaleSwitcherProps {
  /** Omit to auto-source from the nearest `<I18nProvider>` — pass explicitly only to override its list/selection/handler. */
  locale?: string;
  availableLocales?: LocaleOption[];
  onLocaleChange?: (code: string) => void;
  className?: string;
}

/**
 * Auto-sources `locale`/`availableLocales`/`onLocaleChange` from the nearest `<I18nProvider>`
 * when they're omitted (same "controlled-with-context-fallback" pattern as `AdminSidebar`'s
 * `permissions` prop) — usable as `<LocaleSwitcher />` with zero wiring. Still fully
 * presentational underneath: pass any of the three props explicitly to override the context
 * default, e.g. for a consumer with its own locale mechanism.
 */
export function LocaleSwitcher({ locale, availableLocales, onLocaleChange, className }: LocaleSwitcherProps) {
  const i18n = useTranslation();
  const resolvedLocale = locale ?? i18n.locale;
  const resolvedOptions = availableLocales ?? i18n.locales.map((meta) => ({ code: meta.code, label: meta.nativeName }));
  const resolvedOnChange =
    onLocaleChange ??
    ((code: string) => {
      if (isSupportedLocale(code)) i18n.setLocale(code);
    });
  const current = resolvedOptions.find((option) => option.code === resolvedLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            className,
          )}
        >
          <Languages className="h-4 w-4" />
          {current?.label ?? resolvedLocale}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {resolvedOptions.map((option) => (
          <DropdownMenuItem key={option.code} onSelect={() => resolvedOnChange(option.code)}>
            <span className="mr-2 flex h-4 w-4 items-center justify-center">
              {option.code === resolvedLocale ? <Check className="h-4 w-4" /> : null}
            </span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
