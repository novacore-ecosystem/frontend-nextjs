import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface StatProps {
  label: string;
  value: React.ReactNode;
  trend?: { direction: "up" | "down"; label: string };
  className?: string;
  sx?: NovaSx;
}

export function Stat({ label, value, trend, className, sx }: StatProps) {
  return (
    <MuiBox className={className} sx={sx as any}>
      <Text size="bodySmall" color="muted">
        {label}
      </Text>
      <Heading size="h3">{value}</Heading>
      {trend ? (
        <Text size="bodySmall" color={trend.direction === "up" ? "success" : "error"}>
          {trend.direction === "up" ? "▲" : "▼"} {trend.label}
        </Text>
      ) : null}
    </MuiBox>
  );
}
