import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Container } from "../layout/container";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface HeroSectionProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  sx?: NovaSx;
}

export function HeroSection({ eyebrow, title, description, actions, media, align = "center", className, sx }: HeroSectionProps) {
  return (
    <MuiBox
      component="section"
      className={className}
      sx={[{ py: { xs: 8, md: 14 } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <Container>
        <MuiBox
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: align === "center" ? "center" : "flex-start",
            textAlign: align,
            gap: 3,
            maxWidth: media ? undefined : 760,
            mx: align === "center" && !media ? "auto" : undefined,
          }}
        >
          {eyebrow ? (
            <Text size="bodySmall" weight="semibold" color="primary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {eyebrow}
            </Text>
          ) : null}
          <Heading size="display" align={align}>
            {title}
          </Heading>
          {description ? (
            <Text size="bodyLarge" color="muted" align={align} sx={{ maxWidth: 620 }}>
              {description}
            </Text>
          ) : null}
          {actions ? (
            <MuiBox sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start" }}>
              {actions}
            </MuiBox>
          ) : null}
          {media ? <MuiBox sx={{ width: "100%", mt: 4 }}>{media}</MuiBox> : null}
        </MuiBox>
      </Container>
    </MuiBox>
  );
}
