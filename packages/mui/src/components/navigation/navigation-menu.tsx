import MuiStack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavigationMenuProps {
  items: NavigationItem[];
  className?: string;
  sx?: NovaSx;
}

export function NavigationMenu({ items, className, sx }: NavigationMenuProps) {
  return (
    <MuiStack direction="row" spacing={3} className={className} sx={sx as any}>
      {items.map((item) => (
        <MuiLink
          key={item.href}
          href={item.href}
          underline="none"
          sx={{ fontSize: "0.9rem", fontWeight: 500, color: item.active ? "primary.main" : "text.primary", "&:hover": { color: "primary.main" } }}
        >
          {item.label}
        </MuiLink>
      ))}
    </MuiStack>
  );
}
