import MuiChip from "@mui/material/Chip";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export type BadgeTone = "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  variant?: "solid" | "outline";
  className?: string;
  sx?: NovaSx;
}

const TONE_TO_COLOR: Record<BadgeTone, "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"> = {
  default: "default",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
};

export function Badge({ children, tone = "default", variant = "solid", className, sx }: BadgeProps) {
  return (
    <MuiChip
      label={children}
      size="small"
      color={TONE_TO_COLOR[tone]}
      variant={variant === "outline" ? "outlined" : "filled"}
      className={className}
      sx={sx as any}
    />
  );
}

export interface ChipProps extends BadgeProps {
  onDelete?: () => void;
  icon?: React.ReactNode;
}

export function Chip({ children, tone = "default", variant = "solid", onDelete, icon, className, sx }: ChipProps) {
  return (
    <MuiChip
      label={children}
      size="small"
      color={TONE_TO_COLOR[tone]}
      variant={variant === "outline" ? "outlined" : "filled"}
      onDelete={onDelete}
      icon={icon as React.ReactElement}
      className={className}
      sx={sx as any}
    />
  );
}
