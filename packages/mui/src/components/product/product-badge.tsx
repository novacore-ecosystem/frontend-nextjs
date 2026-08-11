import { Badge } from "../data/badge";

export type ProductBadgeKind = "new" | "sale" | "out-of-stock" | "bestseller";

export interface ProductBadgeProps {
  kind: ProductBadgeKind;
  label?: string;
}

const KIND_TO_TONE = {
  new: "info",
  sale: "error",
  "out-of-stock": "default",
  bestseller: "warning",
} as const;

const KIND_TO_LABEL: Record<ProductBadgeKind, string> = {
  new: "New",
  sale: "Sale",
  "out-of-stock": "Out of stock",
  bestseller: "Bestseller",
};

export function ProductBadge({ kind, label }: ProductBadgeProps) {
  return <Badge tone={KIND_TO_TONE[kind]}>{label ?? KIND_TO_LABEL[kind]}</Badge>;
}
