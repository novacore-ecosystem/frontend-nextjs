import MuiAvatar from "@mui/material/Avatar";
import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Container } from "../layout/container";
import { Grid } from "../layout/grid";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  avatarSrc?: string;
}

export interface TestimonialSectionProps {
  title?: React.ReactNode;
  items: Testimonial[];
  className?: string;
  sx?: NovaSx;
}

export function TestimonialSection({ title, items, className, sx }: TestimonialSectionProps) {
  return (
    <MuiBox component="section" className={className} sx={[{ py: { xs: 6, md: 10 } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      <Container>
        {title ? (
          <Heading size="h2" align="center" sx={{ mb: 6 }}>
            {title}
          </Heading>
        ) : null}
        <Grid columns={{ xs: 1, md: items.length >= 3 ? 3 : items.length }} gap={4}>
          {items.map((item) => (
            <MuiBox
              key={item.name}
              sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Text color="muted" sx={{ fontStyle: "italic" }}>
                “{item.quote}”
              </Text>
              <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <MuiAvatar src={item.avatarSrc} alt={item.name} sx={{ width: 36, height: 36 }} />
                <MuiBox>
                  <Text weight="semibold" size="bodySmall">
                    {item.name}
                  </Text>
                  {item.role ? (
                    <Text size="bodySmall" color="muted">
                      {item.role}
                    </Text>
                  ) : null}
                </MuiBox>
              </MuiBox>
            </MuiBox>
          ))}
        </Grid>
      </Container>
    </MuiBox>
  );
}
