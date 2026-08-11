import MuiIconButton from "@mui/material/IconButton";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface IconButtonProps {
  children: React.ReactNode;
  "aria-label": string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  sx?: NovaSx;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const SIZE_MAP = { sm: "small", md: "medium", lg: "large" } as const;

export function IconButton({ children, size = "md", disabled, className, sx, onClick, ...rest }: IconButtonProps) {
  return (
    <MuiIconButton size={SIZE_MAP[size]} disabled={disabled} className={className} sx={sx as any} onClick={onClick} {...rest}>
      {children}
    </MuiIconButton>
  );
}
