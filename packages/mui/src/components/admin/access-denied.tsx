import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import MuiBox from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { NovaSx } from "../../lib/types";
import { Button } from "../actions/button";

export interface AccessDeniedProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Strings are not localized here — pass translated copy from your own i18n setup via these props. */
  backLabel?: string;
  homeLabel?: string;
  backHref?: string;
  homeHref?: string;
  onBack?: () => void;
  onHome?: () => void;
  /** Extra content rendered between the description and the actions, e.g. a support-contact link. */
  children?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

/** Reusable full-region access-denied state for `PermissionBoundary`'s default fallback or standalone route guards. UX only — the backend must still reject the underlying request. */
export function AccessDenied({
  title = "Access denied",
  description = "You do not have permission to access this page.",
  icon,
  backLabel = "Go back",
  homeLabel = "Go to dashboard",
  backHref,
  homeHref,
  onBack,
  onHome,
  children,
  className,
  sx,
}: AccessDeniedProps) {
  const showBack = Boolean(onBack || backHref);
  const showHome = Boolean(onHome || homeHref);

  return (
    <MuiBox
      className={className}
      sx={[
        { display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, p: 4, textAlign: "center" },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      <MuiBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
          color: "error.main",
        }}
      >
        {icon ?? <GppBadOutlinedIcon sx={{ fontSize: 28 }} />}
      </MuiBox>
      <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <MuiTypography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </MuiTypography>
        <MuiTypography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          {description}
        </MuiTypography>
      </MuiBox>
      {children}
      {showBack || showHome ? (
        <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          {showBack ? (
            <Button variant="outline" size="sm" onClick={onBack} href={onBack ? undefined : backHref}>
              {backLabel}
            </Button>
          ) : null}
          {showHome ? (
            <Button variant="primary" size="sm" onClick={onHome} href={onHome ? undefined : homeHref}>
              {homeLabel}
            </Button>
          ) : null}
        </MuiBox>
      ) : null}
    </MuiBox>
  );
}
