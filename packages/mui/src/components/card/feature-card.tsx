import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Text } from "../typography/text";
import { Card, CardContent } from "./card";
import type { NovaSx } from "../../lib/types";

export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function FeatureCard({ icon, title, description, className, sx }: FeatureCardProps) {
  return (
    <Card className={className} sx={sx}>
      <CardContent>
        {icon ? (
          <MuiBox
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "action.hover",
              color: "primary.main",
              mb: 1.5,
            }}
          >
            {icon}
          </MuiBox>
        ) : null}
        <Text weight="semibold" size="bodyLarge">
          {title}
        </Text>
        {description ? (
          <Text color="muted" sx={{ mt: 0.5 }}>
            {description}
          </Text>
        ) : null}
      </CardContent>
    </Card>
  );
}

export interface ActionCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function ActionCard({ title, description, action, className, sx }: ActionCardProps) {
  return (
    <Card className={className} sx={sx}>
      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <MuiBox>
          <Text weight="semibold">{title}</Text>
          {description ? (
            <Text color="muted" size="bodySmall" sx={{ mt: 0.5 }}>
              {description}
            </Text>
          ) : null}
        </MuiBox>
        {action}
      </CardContent>
    </Card>
  );
}
