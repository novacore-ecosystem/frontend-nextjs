import MuiAutocomplete from "@mui/material/Autocomplete";
import MuiTextField from "@mui/material/TextField";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: AutocompleteOption | null;
  onChange?: (option: AutocompleteOption | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  sx?: NovaSx;
}

export function Autocomplete({ options, value, onChange, label, placeholder, disabled, fullWidth = true, className, sx }: AutocompleteProps) {
  return (
    <MuiAutocomplete
      options={options}
      value={value ?? null}
      onChange={onChange ? (_event, option) => onChange(option) : undefined}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      sx={sx as any}
      renderInput={(params) => <MuiTextField {...params} label={label} placeholder={placeholder} />}
    />
  );
}
