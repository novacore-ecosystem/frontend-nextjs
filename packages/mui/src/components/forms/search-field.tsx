import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import MuiIconButton from "@mui/material/IconButton";
import MuiInputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  sx?: NovaSx;
}

export function SearchField({ value, onChange, onClear, placeholder = "Search…", fullWidth = true, className, sx }: SearchFieldProps) {
  return (
    <MuiTextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      className={className}
      sx={sx as any}
      slotProps={{
        input: {
          startAdornment: (
            <MuiInputAdornment position="start">
              <SearchIcon fontSize="small" />
            </MuiInputAdornment>
          ),
          endAdornment: value ? (
            <MuiInputAdornment position="end">
              <MuiIconButton
                aria-label="Clear search"
                size="small"
                onClick={() => {
                  onChange("");
                  onClear?.();
                }}
              >
                <CloseIcon fontSize="small" />
              </MuiIconButton>
            </MuiInputAdornment>
          ) : null,
        },
      }}
    />
  );
}
