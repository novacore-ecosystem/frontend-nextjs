"use client";

import MuiBox from "@mui/material/Box";
import * as React from "react";
import { ResponsiveImage } from "../image/responsive-image";
import type { NovaSx } from "../../lib/types";

export interface ProductGalleryProps {
  images: string[];
  alt?: string;
  ratio?: number;
  className?: string;
  sx?: NovaSx;
}

export function ProductGallery({ images, alt = "", ratio = 1, className, sx }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <MuiBox className={className} sx={sx as any}>
      <ResponsiveImage src={active} alt={alt} ratio={ratio} />
      {images.length > 1 ? (
        <MuiBox sx={{ display: "flex", gap: 1, mt: 1.5, overflowX: "auto" }}>
          {images.map((image, index) => (
            <MuiBox
              key={image}
              component="button"
              onClick={() => setActiveIndex(index)}
              sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                p: 0,
                borderRadius: 1,
                overflow: "hidden",
                border: "2px solid",
                borderColor: index === activeIndex ? "primary.main" : "transparent",
                cursor: "pointer",
                bgcolor: "transparent",
              }}
            >
              <ResponsiveImage src={image} alt="" ratio={1} />
            </MuiBox>
          ))}
        </MuiBox>
      ) : null}
    </MuiBox>
  );
}
