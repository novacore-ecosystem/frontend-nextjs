import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Container } from "../layout/container";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface CTASectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function CTASection({ title, description, actions, className, sx }: CTASectionProps) {
  return (
    <MuiBox
      component="section"
      className={className}
      sx={[{ py: { xs: 8, md: 12 } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <Container maxWidth="md">
        <MuiBox
          sx={{
            textAlign: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 3,
            py: { xs: 6, md: 8 },
            px: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Heading size="h2" align="center" sx={{ color: "inherit" }}>
            {title}
          </Heading>
          {description ? (
            <Text align="center" sx={{ color: "inherit", opacity: 0.9, maxWidth: 520 }}>
              {description}
            </Text>
          ) : null}
          {actions ? <MuiBox sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mt: 1 }}>{actions}</MuiBox> : null}
        </MuiBox>
      </Container>
    </MuiBox>
  );
}
