import * as React from "react";
import { Badge, type BadgeVariant } from "../ui/badge";

export type StatusTone = "neutral" | "success" | "warning" | "destructive" | "info";

const TONE_TO_VARIANT: Record<StatusTone, BadgeVariant> = {
  neutral: "secondary",
  success: "success",
  warning: "warning",
  destructive: "destructive",
  info: "info",
};

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({ label, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <Badge variant={TONE_TO_VARIANT[tone]} className={className}>
      {label}
    </Badge>
  );
}
