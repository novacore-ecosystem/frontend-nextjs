import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface ProductVariantOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ProductVariantSelectorProps {
  label?: string;
  options: ProductVariantOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  sx?: NovaSx;
}

/** Fully controlled — no internal state, so it stays composable inside either server- or client-rendered trees. */
export function ProductVariantSelector({ label, options, value, onChange, className, sx }: ProductVariantSelectorProps) {
  return (
    <MuiBox className={className} sx={sx as any}>
      {label ? (
        <Text size="bodySmall" weight="medium" sx={{ mb: 1 }}>
          {label}
        </Text>
      ) : null}
      <MuiBox sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <MuiBox
              key={option.value}
              component="button"
              type="button"
              disabled={option.disabled}
              onClick={onChange ? () => onChange(option.value) : undefined}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1.5,
                fontSize: "0.875rem",
                border: "1px solid",
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "primary.main" : "transparent",
                color: selected ? "primary.contrastText" : "text.primary",
                cursor: option.disabled ? "not-allowed" : "pointer",
                opacity: option.disabled ? 0.4 : 1,
              }}
            >
              {option.label}
            </MuiBox>
          );
        })}
      </MuiBox>
    </MuiBox>
  );
}
