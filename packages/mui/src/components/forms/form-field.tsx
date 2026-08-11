import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Text } from "../typography/text";
import { Label } from "../typography/misc";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface FormFieldProps extends WithChildren {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  sx?: NovaSx;
}

export function FormField({ label, htmlFor, required, description, error, className, sx, children }: FormFieldProps) {
  return (
    <MuiBox className={className} sx={[{ display: "grid", gap: 0.75 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {label ? (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      {children}
      {description && !error ? (
        <Text size="bodySmall" color="muted">
          {description}
        </Text>
      ) : null}
      {error ? (
        <Text size="bodySmall" color="error">
          {error}
        </Text>
      ) : null}
    </MuiBox>
  );
}
