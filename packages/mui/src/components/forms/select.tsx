import MuiMenuItem from "@mui/material/MenuItem";
import MuiTextField from "@mui/material/TextField";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  name?: string;
  id?: string;
  className?: string;
  sx?: NovaSx;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  helperText,
  error,
  disabled,
  required,
  fullWidth = true,
  name,
  id,
  className,
  sx,
}: SelectProps) {
  return (
    <MuiTextField
      select
      value={value}
      defaultValue={defaultValue}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      name={name}
      id={id}
      className={className}
      sx={sx as any}
      slotProps={{ select: { displayEmpty: Boolean(placeholder) } }}
    >
      {placeholder ? (
        <MuiMenuItem value="" disabled>
          {placeholder}
        </MuiMenuItem>
      ) : null}
      {options.map((option) => (
        <MuiMenuItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </MuiMenuItem>
      ))}
    </MuiTextField>
  );
}
