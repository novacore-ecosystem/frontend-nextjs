import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Card, CardContent } from "../card/card";
import { ResponsiveImage } from "../image/responsive-image";
import { Text } from "../typography/text";
import { Price } from "./price";
import { ProductBadge, type ProductBadgeKind } from "./product-badge";
import { Rating } from "../data/rating";
import type { NovaSx } from "../../lib/types";

export interface ProductCardViewModel {
  id: string;
  title: string;
  image: string;
  imageAlt?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  badge?: ProductBadgeKind;
  href?: string;
}

export interface ProductCardProps {
  product: ProductCardViewModel;
  onClick?: (product: ProductCardViewModel) => void;
  actions?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

/** Renders a `ProductCardViewModel` — map your ProductService DTO into this shape at the call site. */
export function ProductCard({ product, onClick, actions, className, sx }: ProductCardProps) {
  const body = (
    <Card hoverable clickable={Boolean(onClick || product.href)} className={className} sx={sx} onClick={onClick ? () => onClick(product) : undefined}>
      <MuiBox sx={{ position: "relative" }}>
        <ResponsiveImage src={product.image} alt={product.imageAlt ?? product.title} ratio={1} />
        {product.badge ? (
          <MuiBox sx={{ position: "absolute", top: 12, left: 12 }}>
            <ProductBadge kind={product.badge} />
          </MuiBox>
        ) : null}
      </MuiBox>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Text weight="medium">{product.title}</Text>
        {product.rating !== undefined ? <Rating value={product.rating} count={product.reviewCount} size="sm" /> : null}
        <Price amount={product.price} compareAtAmount={product.compareAtPrice} currency={product.currency} />
        {actions}
      </CardContent>
    </Card>
  );

  if (!product.href) return body;

  return (
    <MuiBox component="a" href={product.href} sx={{ textDecoration: "none", display: "block" }}>
      {body}
    </MuiBox>
  );
}
