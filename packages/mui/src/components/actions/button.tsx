import CircularProgress from "@mui/material/CircularProgress";
import MuiButton from "@mui/material/Button";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
  className?: string;
  sx?: NovaSx;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const VARIANT_MAP: Record<ButtonVariant, { variant: "contained" | "outlined" | "text"; color?: "primary" | "error" }> = {
  primary: { variant: "contained", color: "primary" },
  secondary: { variant: "contained", color: undefined },
  outline: { variant: "outlined", color: "primary" },
  ghost: { variant: "text", color: "primary" },
  destructive: { variant: "contained", color: "error" },
  link: { variant: "text", color: "primary" },
};

const SIZE_MAP: Record<ButtonSize, "small" | "medium" | "large"> = { sm: "small", md: "medium", lg: "large" };

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  fullWidth,
  startIcon,
  endIcon,
  type = "button",
  href,
  target,
  className,
  sx,
  onClick,
}: ButtonProps) {
  const mapped = VARIANT_MAP[variant];
  const buttonProps: Record<string, unknown> = {
    variant: mapped.variant,
    color: mapped.color,
    size: SIZE_MAP[size],
    disabled: disabled || loading,
    fullWidth,
    startIcon: loading ? <CircularProgress size={16} color="inherit" /> : startIcon,
    endIcon: loading ? undefined : endIcon,
    type,
    href,
    target,
    className,
    sx: [variant === "link" ? { textDecoration: "underline", px: 0, minWidth: 0 } : {}, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])],
    onClick,
  };
  return <MuiButton {...(buttonProps as React.ComponentProps<typeof MuiButton>)}>{children}</MuiButton>;
}
