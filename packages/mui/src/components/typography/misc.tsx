import MuiLink from "@mui/material/Link";
import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface LabelProps extends WithChildren {
  htmlFor?: string;
  required?: boolean;
  className?: string;
  sx?: NovaSx;
}

export function Label({ htmlFor, required, className, sx, children }: LabelProps) {
  return (
    <MuiTypography
      component="label"
      htmlFor={htmlFor}
      className={className}
      sx={[{ fontSize: "0.875rem", fontWeight: 500, display: "inline-block" }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
      {required ? (
        <MuiTypography component="span" sx={{ color: "error.main", ml: 0.5 }}>
          *
        </MuiTypography>
      ) : null}
    </MuiTypography>
  );
}

export interface CaptionProps extends WithChildren {
  className?: string;
  sx?: NovaSx;
}

export function Caption({ className, sx, children }: CaptionProps) {
  return (
    <MuiTypography variant="caption" className={className} sx={[{ color: "text.secondary" }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {children}
    </MuiTypography>
  );
}

export interface LinkProps extends WithChildren {
  href: string;
  external?: boolean;
  underline?: "none" | "hover" | "always";
  className?: string;
  sx?: NovaSx;
}

export function Link({ href, external, underline = "hover", className, sx, children }: LinkProps) {
  return (
    <MuiLink
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      underline={underline}
      className={className}
      sx={sx as any}
    >
      {children}
    </MuiLink>
  );
}

export interface CodeProps extends WithChildren {
  className?: string;
  sx?: NovaSx;
}

export function Code({ className, sx, children }: CodeProps) {
  return (
    <MuiTypography
      component="code"
      className={className}
      sx={[
        { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.875em", bgcolor: "action.hover", px: 0.75, py: 0.25, borderRadius: 1 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      {children}
    </MuiTypography>
  );
}
