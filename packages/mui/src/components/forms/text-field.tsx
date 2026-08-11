import MuiTextField from "@mui/material/TextField";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface TextFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "email" | "tel" | "url" | "number" | "date";
  name?: string;
  id?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function TextField({
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  helperText,
  error,
  disabled,
  required,
  type = "text",
  name,
  id,
  fullWidth = true,
  autoFocus,
  startAdornment,
  endAdornment,
  className,
  sx,
}: TextFieldProps) {
  return (
    <MuiTextField
      value={value}
      defaultValue={defaultValue}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      placeholder={placeholder}
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      type={type}
      name={name}
      id={id}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      className={className}
      sx={sx as any}
      slotProps={{
        input: {
          startAdornment,
          endAdornment,
        },
      }}
    />
  );
}
