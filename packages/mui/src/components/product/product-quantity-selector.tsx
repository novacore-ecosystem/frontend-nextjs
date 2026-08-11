import MuiBox from "@mui/material/Box";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";
import { IconButton } from "../actions/icon-button";
import type { NovaSx } from "../../lib/types";

export interface ProductQuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  sx?: NovaSx;
}

export function ProductQuantitySelector({ value, onChange, min = 1, max = 99, className, sx }: ProductQuantitySelectorProps) {
  return (
    <MuiBox
      className={className}
      sx={[
        { display: "inline-flex", alignItems: "center", border: "1px solid", borderColor: "divider", borderRadius: 1.5 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      <IconButton aria-label="Decrease quantity" size="sm" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        <RemoveIcon fontSize="small" />
      </IconButton>
      <MuiBox sx={{ minWidth: 32, textAlign: "center", fontSize: "0.875rem" }}>{value}</MuiBox>
      <IconButton aria-label="Increase quantity" size="sm" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <AddIcon fontSize="small" />
      </IconButton>
    </MuiBox>
  );
}
