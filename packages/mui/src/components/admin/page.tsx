import MuiBox from "@mui/material/Box";
import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { NovaSx } from "../../lib/types";

export interface AdminPageProps {
  children: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function AdminPage({ children, className, sx }: AdminPageProps) {
  return (
    <MuiBox
      className={className}
      sx={[{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2, md: 3 } }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
    </MuiBox>
  );
}

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function PageContainer({ children, className, sx }: PageContainerProps) {
  return (
    <MuiBox className={className} sx={[{ mx: "auto", width: "100%", maxWidth: 1280 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {children}
    </MuiBox>
  );
}

export interface PageSectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function PageSection({ title, description, actions, children, className, sx }: PageSectionProps) {
  return (
    <MuiBox component="section" className={className} sx={[{ display: "flex", flexDirection: "column", gap: 2 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {title || description || actions ? (
        <MuiBox sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
          <MuiBox>
            {title ? (
              <MuiTypography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {title}
              </MuiTypography>
            ) : null}
            {description ? (
              <MuiTypography variant="body2" color="text.secondary">
                {description}
              </MuiTypography>
            ) : null}
          </MuiBox>
          {actions ? <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>{actions}</MuiBox> : null}
        </MuiBox>
      ) : null}
      {children}
    </MuiBox>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Rendered inline next to the title, e.g. a `StatusBadge`/`Chip`. */
  status?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function PageHeader({ title, description, status, actions, breadcrumb, className, sx }: PageHeaderProps) {
  return (
    <MuiBox className={className} sx={[{ display: "flex", flexDirection: "column", gap: 1.5 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}>
      {breadcrumb}
      <MuiBox sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
        <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <MuiTypography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
              {title}
            </MuiTypography>
            {status}
          </MuiBox>
          {description ? (
            <MuiTypography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
              {description}
            </MuiTypography>
          ) : null}
        </MuiBox>
        {actions ? <MuiBox sx={{ display: "flex", flexShrink: 0, alignItems: "center", gap: 1 }}>{actions}</MuiBox> : null}
      </MuiBox>
    </MuiBox>
  );
}

export interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function Toolbar({ children, className, sx }: ToolbarProps) {
  return (
    <MuiBox
      className={className}
      sx={[{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      {children}
    </MuiBox>
  );
}

export interface ContentPanelProps {
  children: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function ContentPanel({ children, className, sx }: ContentPanelProps) {
  return (
    <MuiBox
      className={className}
      sx={[
        { borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", p: 2 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      {children}
    </MuiBox>
  );
}
