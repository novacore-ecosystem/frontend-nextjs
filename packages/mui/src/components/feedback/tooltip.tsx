import MuiTooltip from "@mui/material/Tooltip";
import * as React from "react";

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const SIDE_TO_PLACEMENT: Record<NonNullable<TooltipProps["side"]>, "top" | "right" | "bottom" | "left"> = {
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
};

export function Tooltip({ children, content, side = "top" }: TooltipProps) {
  return (
    <MuiTooltip title={content} placement={SIDE_TO_PLACEMENT[side]} arrow>
      {children}
    </MuiTooltip>
  );
}
