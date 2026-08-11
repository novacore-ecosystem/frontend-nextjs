import CloseIcon from "@mui/icons-material/Close";
import MuiDialog from "@mui/material/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiIconButton from "@mui/material/IconButton";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface DialogProps extends WithChildren {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  sx?: NovaSx;
}

export function Dialog({ open, onClose, title, maxWidth = "sm", fullWidth = true, className, sx, children }: DialogProps) {
  return (
    <MuiDialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} className={className} sx={sx as any}>
      {title ? (
        <MuiDialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {title}
          <MuiIconButton aria-label="Close" size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </MuiIconButton>
        </MuiDialogTitle>
      ) : null}
      {children}
    </MuiDialog>
  );
}

export function DialogContent({ children, className, sx }: WithChildren & { className?: string; sx?: NovaSx }) {
  return (
    <MuiDialogContent className={className} sx={sx as any}>
      {children}
    </MuiDialogContent>
  );
}

export function DialogFooter({ children, className, sx }: WithChildren & { className?: string; sx?: NovaSx }) {
  return (
    <MuiDialogActions className={className} sx={sx as any}>
      {children}
    </MuiDialogActions>
  );
}
