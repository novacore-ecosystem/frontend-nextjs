import MuiBox from "@mui/material/Box";
import MuiTextField from "@mui/material/TextField";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface DateFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  name?: string;
  id?: string;
  className?: string;
  sx?: NovaSx;
}

/**
 * Wraps the native `<input type="date">` (via MUI TextField) rather than
 * pulling in `@mui/x-date-pickers` + a date-adapter dependency — keeps the
 * package lightweight for phase 1. Values are ISO date strings ("YYYY-MM-DD").
 */
export function DateField({ value, onChange, label, min, max, disabled, required, fullWidth = true, name, id, className, sx }: DateFieldProps) {
  return (
    <MuiTextField
      type="date"
      value={value}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      label={label}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      name={name}
      id={id}
      className={className}
      sx={sx as any}
      slotProps={{ inputLabel: { shrink: true }, htmlInput: { min, max } }}
    />
  );
}

export interface DateRangeFieldProps {
  startValue?: string;
  endValue?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  startLabel?: string;
  endLabel?: string;
  className?: string;
  sx?: NovaSx;
}

export function DateRangeField({ startValue, endValue, onStartChange, onEndChange, startLabel = "From", endLabel = "To", className, sx }: DateRangeFieldProps) {
  return (
    <MuiBox className={className} sx={[{ display: "flex", gap: 2 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      <DateField value={startValue} onChange={onStartChange} label={startLabel} max={endValue} />
      <DateField value={endValue} onChange={onEndChange} label={endLabel} min={startValue} />
    </MuiBox>
  );
}
