import { formatCurrency } from "@novacore/frontend-foundation";
import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface PriceProps {
  amount: number;
  currency: string;
  compareAtAmount?: number;
  locale?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  sx?: NovaSx;
}

const SIZE_TO_TEXT: Record<NonNullable<PriceProps["size"]>, "bodySmall" | "body" | "bodyLarge"> = {
  sm: "bodySmall",
  md: "body",
  lg: "bodyLarge",
};

/** Formats amounts via `@novacore/frontend-foundation`'s `formatCurrency` (Intl-backed, locale/CLDR-correct). */
export function Price({ amount, currency, compareAtAmount, locale, size = "md", className, sx }: PriceProps) {
  const onSale = compareAtAmount !== undefined && compareAtAmount > amount;
  return (
    <MuiBox className={className} sx={[{ display: "flex", alignItems: "baseline", gap: 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      <Text weight="bold" size={SIZE_TO_TEXT[size]} color={onSale ? "error" : "default"}>
        {formatCurrency(amount, currency, { locale })}
      </Text>
      {onSale ? (
        <Text size="bodySmall" color="muted" sx={{ textDecoration: "line-through" }}>
          {formatCurrency(compareAtAmount!, currency, { locale })}
        </Text>
      ) : null}
    </MuiBox>
  );
}
