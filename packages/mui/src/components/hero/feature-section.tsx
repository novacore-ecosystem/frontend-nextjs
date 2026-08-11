import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Container } from "../layout/container";
import { Grid } from "../layout/grid";
import { Heading } from "../typography/heading";
import { Text } from "../typography/text";
import type { NovaSx, ResponsiveValue } from "../../lib/types";

export interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export interface FeatureGridProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: FeatureItem[];
  columns?: ResponsiveValue<number>;
  className?: string;
  sx?: NovaSx;
}

export function FeatureGrid({ title, description, items, columns = { xs: 1, sm: 2, md: 3 }, className, sx }: FeatureGridProps) {
  return (
    <MuiBox component="section" className={className} sx={[{ py: { xs: 6, md: 10 } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      <Container>
        {(title || description) && (
          <MuiBox sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 6 }}>
            {title ? <Heading size="h2" align="center">{title}</Heading> : null}
            {description ? (
              <Text color="muted" align="center" sx={{ mt: 1.5 }}>
                {description}
              </Text>
            ) : null}
          </MuiBox>
        )}
        <Grid columns={columns} gap={4}>
          {items.map((item) => (
            <MuiBox key={item.title} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {item.icon ? (
                <MuiBox
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  {item.icon}
                </MuiBox>
              ) : null}
              <Text weight="semibold" size="bodyLarge">
                {item.title}
              </Text>
              {item.description ? <Text color="muted">{item.description}</Text> : null}
            </MuiBox>
          ))}
        </Grid>
      </Container>
    </MuiBox>
  );
}
