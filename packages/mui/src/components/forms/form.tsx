import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface FormProps extends WithChildren {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  sx?: NovaSx;
}

export function Form({ onSubmit, className, sx, children }: FormProps) {
  return (
    <MuiBox
      component="form"
      onSubmit={onSubmit}
      className={className}
      sx={[{ display: "flex", flexDirection: "column", gap: 2.5 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
    </MuiBox>
  );
}

export function FormActions({ className, sx, children }: WithChildren & { className?: string; sx?: NovaSx }) {
  return (
    <MuiBox
      className={className}
      sx={[{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
    </MuiBox>
  );
}
