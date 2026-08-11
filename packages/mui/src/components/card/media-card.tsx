import MuiBox from "@mui/material/Box";
import * as React from "react";
import { ResponsiveImage } from "../image/responsive-image";
import { Text } from "../typography/text";
import { Card, CardContent, CardFooter } from "./card";
import type { NovaSx } from "../../lib/types";

export interface MediaCardProps {
  image: string;
  imageAlt?: string;
  ratio?: number;
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
  className?: string;
  sx?: NovaSx;
}

export function MediaCard({ image, imageAlt, ratio = 4 / 3, title, description, footer, href, className, sx }: MediaCardProps) {
  const content = (
    <Card hoverable={Boolean(href)} clickable={Boolean(href)} className={className} sx={sx}>
      <ResponsiveImage src={image} alt={imageAlt ?? ""} ratio={ratio} />
      <CardContent>
        <Text weight="semibold" size="bodyLarge">
          {title}
        </Text>
        {description ? (
          <Text color="muted" sx={{ mt: 0.5 }}>
            {description}
          </Text>
        ) : null}
      </CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );

  if (!href) return content;

  return (
    <MuiBox component="a" href={href} sx={{ textDecoration: "none", display: "block" }}>
      {content}
    </MuiBox>
  );
}
