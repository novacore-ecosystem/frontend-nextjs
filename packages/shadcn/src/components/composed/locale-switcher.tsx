"use client";

import { Check, Languages } from "lucide-react";
import * as React from "react";
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
  locale: string;
  availableLocales: LocaleOption[];
  onLocaleChange: (code: string) => void;
  className?: string;
}

/** Presentational only — no store/i18n-library coupling, so it stays reusable for any consumer's own locale mechanism. */
export function LocaleSwitcher({ locale, availableLocales, onLocaleChange, className }: LocaleSwitcherProps) {
  const current = availableLocales.find((option) => option.code === locale);

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
          {current?.label ?? locale}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLocales.map((option) => (
          <DropdownMenuItem key={option.code} onSelect={() => onLocaleChange(option.code)}>
            <span className="mr-2 flex h-4 w-4 items-center justify-center">
              {option.code === locale ? <Check className="h-4 w-4" /> : null}
            </span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
