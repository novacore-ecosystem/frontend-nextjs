"use client";

import MuiBox from "@mui/material/Box";
import NextImage, { type ImageProps as NextImageProps } from "next/image";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  ratio?: number;
  fit?: "cover" | "contain";
  fallbackSrc?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  sx?: NovaSx;
}

/**
 * Thin wrapper over `next/image` — keeps Next's image optimization/loading
 * behavior intact (does not reimplement it) while adding aspect-ratio
 * framing, object-fit, and an error fallback as NovaCore-owned concerns.
 */
export function ResponsiveImage({ src, alt, ratio = 4 / 3, fit = "cover", fallbackSrc, sizes, priority, className, sx }: ResponsiveImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src);

  React.useEffect(() => setCurrentSrc(src), [src]);

  const fillProps: Pick<NextImageProps, "fill"> = { fill: true };

  return (
    <MuiBox
      className={className}
      sx={[{ position: "relative", width: "100%", aspectRatio: `${ratio}`, overflow: "hidden" }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <NextImage
        src={currentSrc}
        alt={alt}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
        style={{ objectFit: fit }}
        onError={() => {
          if (fallbackSrc && currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
        }}
        {...fillProps}
      />
    </MuiBox>
  );
}
