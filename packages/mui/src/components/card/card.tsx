import MuiCard from "@mui/material/Card";
import MuiCardActions from "@mui/material/CardActions";
import MuiCardContent from "@mui/material/CardContent";
import MuiBox from "@mui/material/Box";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface CardProps extends WithChildren {
  hoverable?: boolean;
  clickable?: boolean;
  elevation?: "none" | "flat" | "raised";
  className?: string;
  sx?: NovaSx;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const ELEVATION_MAP = { none: 0, flat: 0, raised: 2 };

export function Card({ hoverable, clickable, elevation = "flat", className, sx, onClick, children }: CardProps) {
  return (
    <MuiCard
      elevation={ELEVATION_MAP[elevation]}
      className={className}
      onClick={onClick}
      sx={[
        {
          transition: "transform 150ms ease, box-shadow 150ms ease",
          cursor: clickable ? "pointer" : undefined,
          ...(hoverable ? { "&:hover": { transform: "translateY(-2px)", boxShadow: 4 } } : {}),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      {children}
    </MuiCard>
  );
}

export function CardHeader({ children, className, sx }: WithChildren & { className?: string; sx?: NovaSx }) {
  return (
    <MuiBox className={className} sx={[{ p: 2.5, pb: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {children}
    </MuiBox>
  );
}

export function CardContent({ children, className, sx }: WithChildren & { className?: string; sx?: NovaSx }) {
  return (
    <MuiCardContent className={className} sx={sx as any}>
      {children}
    </MuiCardContent>
  );
}

export function CardFooter({ children, className, sx }: WithChildren & { className?: string; sx?: NovaSx }) {
  return (
    <MuiCardActions className={className} sx={[{ p: 2.5, pt: 0 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {children}
    </MuiCardActions>
  );
}
