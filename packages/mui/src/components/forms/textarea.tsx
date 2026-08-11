import MuiTextField from "@mui/material/TextField";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  name?: string;
  id?: string;
  fullWidth?: boolean;
  className?: string;
  sx?: NovaSx;
}

export function Textarea({
  value,
  defaultValue,
  onChange,
  placeholder,
  label,
  helperText,
  error,
  disabled,
  required,
  rows = 4,
  name,
  id,
  fullWidth = true,
  className,
  sx,
}: TextareaProps) {
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
      name={name}
      id={id}
      fullWidth={fullWidth}
      multiline
      rows={rows}
      className={className}
      sx={sx as any}
    />
  );
}
