"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useTranslation } from "../../i18n";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Popover } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import type { TenantDirectoryService, TenantOption } from "./types";

export interface TenantSelectorProps {
  service: TenantDirectoryService;
  value: TenantOption | null;
  onChange: (tenant: TenantOption) => void;
  disabled?: boolean;
  className?: string;
}

/** Search + select for choosing a tenant at login, shown only when the app has no env-configured tenant (see `useTenantLoginConfiguration`). */
export function TenantSelector({ service, value, onChange, disabled, className }: TenantSelectorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [options, setOptions] = React.useState<TenantOption[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading" | "ready" | "error">("idle");

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("loading");
    service
      .searchTenants(debouncedQuery)
      .then((results) => {
        if (cancelled) return;
        setOptions(results);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [service, open, debouncedQuery]);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      align="start"
      className="w-72 p-0"
      trigger={
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>{value ? value.name : t("tenantSelector.placeholder")}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      }
    >
      <Command shouldFilter={false}>
        <CommandInput placeholder={t("tenantSelector.searchPlaceholder")} value={query} onValueChange={setQuery} />
        <CommandList>
          {status === "loading" ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("tenantSelector.loading")}
            </div>
          ) : status === "error" ? (
            <p className="py-6 text-center text-sm text-destructive">{t("tenantSelector.error")}</p>
          ) : (
            <>
              <CommandEmpty>{t("tenantSelector.empty")}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value?.id === option.id ? "opacity-100" : "opacity-0")} />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </Popover>
  );
}
