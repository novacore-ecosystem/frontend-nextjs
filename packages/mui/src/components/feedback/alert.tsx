import MuiAlert from "@mui/material/Alert";
import MuiAlertTitle from "@mui/material/AlertTitle";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export type AlertTone = "info" | "success" | "warning" | "error";

export interface AlertProps extends WithChildren {
  tone?: AlertTone;
  title?: string;
  onClose?: () => void;
  className?: string;
  sx?: NovaSx;
}

export function Alert({ tone = "info", title, onClose, className, sx, children }: AlertProps) {
  return (
    <MuiAlert severity={tone} onClose={onClose} className={className} sx={sx as any}>
      {title ? <MuiAlertTitle>{title}</MuiAlertTitle> : null}
      {children}
    </MuiAlert>
  );
}
