import MuiBox from "@mui/material/Box";
import MuiContainer from "@mui/material/Container";
import MuiDivider from "@mui/material/Divider";
import * as React from "react";
import type { NovaSx, WithChildren } from "../../lib/types";

export interface FooterProps extends WithChildren {
  bottomBar?: React.ReactNode;
  className?: string;
  sx?: NovaSx;
}

export function Footer({ bottomBar, className, sx, children }: FooterProps) {
  return (
    <MuiBox
      component="footer"
      className={className}
      sx={[{ borderTop: "1px solid", borderColor: "divider", bgcolor: "background.default", pt: 8, pb: 4 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as any}
    >
      <MuiContainer maxWidth="lg">
        <MuiBox sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>{children}</MuiBox>
        {bottomBar ? (
          <>
            <MuiDivider sx={{ my: 4 }} />
            <MuiBox sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-between", alignItems: "center" }}>{bottomBar}</MuiBox>
          </>
        ) : null}
      </MuiContainer>
    </MuiBox>
  );
}

export function FooterColumn({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {title ? (
        <MuiBox component="p" sx={{ fontSize: "0.875rem", fontWeight: 600, m: 0 }}>
          {title}
        </MuiBox>
      ) : null}
      {children}
    </MuiBox>
  );
}
