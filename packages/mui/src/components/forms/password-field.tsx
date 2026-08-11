"use client";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MuiIconButton from "@mui/material/IconButton";
import MuiInputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface PasswordFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
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

export function PasswordField({
  value,
  defaultValue,
  onChange,
  label,
  placeholder,
  helperText,
  error,
  disabled,
  required,
  fullWidth = true,
  name,
  id,
  className,
  sx,
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <MuiTextField
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => onChange?.(event.target.value)}
      type={visible ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      name={name}
      id={id}
      className={className}
      sx={sx as any}
      slotProps={{
        input: {
          endAdornment: (
            <MuiInputAdornment position="end">
              <MuiIconButton aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((prev) => !prev)} edge="end">
                {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </MuiIconButton>
            </MuiInputAdornment>
          ),
        },
      }}
    />
  );
}
