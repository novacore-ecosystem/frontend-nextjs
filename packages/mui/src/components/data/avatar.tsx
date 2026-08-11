import MuiAvatar from "@mui/material/Avatar";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  sx?: NovaSx;
}

const SIZE_MAP = { sm: 28, md: 36, lg: 48 };

export function Avatar({ src, alt, fallback, size = "md", className, sx }: AvatarProps) {
  const px = SIZE_MAP[size];
  return (
    <MuiAvatar
      src={src}
      alt={alt}
      className={className}
      sx={[{ width: px, height: px, fontSize: px * 0.4 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {fallback}
    </MuiAvatar>
  );
}
