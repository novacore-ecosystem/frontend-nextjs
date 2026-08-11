import MuiBox from "@mui/material/Box";
import MuiCircularProgress from "@mui/material/CircularProgress";
import MuiLinearProgress from "@mui/material/LinearProgress";
import MuiSkeleton from "@mui/material/Skeleton";
import * as React from "react";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface ProgressProps {
  variant?: "linear" | "circular";
  value?: number;
  className?: string;
  sx?: NovaSx;
}

export function Progress({ variant = "linear", value, className, sx }: ProgressProps) {
  if (variant === "circular") {
    return <MuiCircularProgress variant={value !== undefined ? "determinate" : "indeterminate"} value={value} className={className} sx={sx as any} />;
  }
  return <MuiLinearProgress variant={value !== undefined ? "determinate" : "indeterminate"} value={value} className={className} sx={sx as any} />;
}

export interface SkeletonProps {
  variant?: "text" | "rectangular" | "circular";
  width?: number | string;
  height?: number | string;
  className?: string;
  sx?: NovaSx;
}

export function Skeleton({ variant = "text", width, height, className, sx }: SkeletonProps) {
  return <MuiSkeleton variant={variant} width={width} height={height} className={className} sx={sx as any} />;
}

export function Loading({ label = "Loading…", className, sx }: { label?: string; className?: string; sx?: NovaSx }) {
  return (
    <MuiBox
      className={className}
      sx={[{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 6, color: "text.secondary" }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <MuiCircularProgress size={28} />
      <Text size="bodySmall" color="muted">
        {label}
      </Text>
    </MuiBox>
  );
}
