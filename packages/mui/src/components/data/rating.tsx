import MuiBox from "@mui/material/Box";
import MuiRating from "@mui/material/Rating";
import * as React from "react";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface RatingProps {
  value: number;
  count?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  sx?: NovaSx;
}

const SIZE_MAP = { sm: "small", md: "medium", lg: "large" } as const;

export function Rating({ value, count, max = 5, size = "md", readOnly = true, onChange, className, sx }: RatingProps) {
  return (
    <MuiBox className={className} sx={[{ display: "flex", alignItems: "center", gap: 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      <MuiRating
        value={value}
        max={max}
        size={SIZE_MAP[size]}
        readOnly={readOnly}
        precision={0.5}
        onChange={onChange ? (_event, newValue) => onChange(newValue ?? 0) : undefined}
      />
      {count !== undefined ? (
        <Text size="bodySmall" color="muted">
          ({count})
        </Text>
      ) : null}
    </MuiBox>
  );
}
