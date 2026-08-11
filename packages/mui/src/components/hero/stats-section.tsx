import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Container } from "../layout/container";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsSectionProps {
  items: StatItem[];
  className?: string;
  sx?: NovaSx;
}

export function StatsSection({ items, className, sx }: StatsSectionProps) {
  return (
    <MuiBox component="section" className={className} sx={[{ py: { xs: 6, md: 10 } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      <Container>
        <MuiBox sx={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 3, textAlign: "center" }}>
          {items.map((item) => (
            <MuiBox key={item.label}>
              <Heading size="h1" align="center">
                {item.value}
              </Heading>
              <Text color="muted" align="center">
                {item.label}
              </Text>
            </MuiBox>
          ))}
        </MuiBox>
      </Container>
    </MuiBox>
  );
}
