import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  sx?: NovaSx;
}

export function Breadcrumb({ items, className, sx }: BreadcrumbProps) {
  return (
    <MuiBreadcrumbs className={className} sx={sx as any}>
      {items.map((item, index) =>
        item.href && index !== items.length - 1 ? (
          <MuiLink key={item.href} href={item.href} underline="hover" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            {item.label}
          </MuiLink>
        ) : (
          <MuiTypography key={item.label} sx={{ fontSize: "0.875rem", color: "text.primary" }}>
            {item.label}
          </MuiTypography>
        ),
      )}
    </MuiBreadcrumbs>
  );
}
