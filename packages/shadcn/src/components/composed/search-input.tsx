"use client";

import { Search, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";
import { Input, type InputProps } from "../ui/input";

export interface SearchInputProps extends Omit<InputProps, "value" | "onChange" | "type"> {
  value?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onValueChange, onClear, placeholder = "Search…", ...props }, ref) => (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={ref}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange?.(event.target.value)}
        className="pl-8 pr-8"
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onValueChange?.("");
            onClear?.();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  ),
);
SearchInput.displayName = "SearchInput";
