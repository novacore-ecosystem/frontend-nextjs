import * as React from "react";
import { Grid } from "../layout/grid";
import { ProductCard, type ProductCardViewModel } from "./product-card";
import type { NovaSx, ResponsiveValue } from "../../lib/types";

export interface ProductGridProps {
  products: ProductCardViewModel[];
  columns?: ResponsiveValue<number>;
  onProductClick?: (product: ProductCardViewModel) => void;
  renderActions?: (product: ProductCardViewModel) => React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function ProductGrid({ products, columns = { xs: 2, sm: 2, md: 3, lg: 4 }, onProductClick, renderActions, className, sx }: ProductGridProps) {
  return (
    <Grid columns={columns} gap={3} className={className} sx={sx}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onProductClick} actions={renderActions?.(product)} />
      ))}
    </Grid>
  );
}
