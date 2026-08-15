"use client";

import CheckIcon from "@mui/icons-material/Check";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import MuiBox from "@mui/material/Box";
import MuiListItemText from "@mui/material/ListItemText";
import MuiMenu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import MuiTypography from "@mui/material/Typography";
import * as React from "react";
import type { ApplicationDefinition } from "./nav-types";

export interface ApplicationSwitcherProps {
  applications: ApplicationDefinition[];
  currentId: string;
  onSelect?: (application: ApplicationDefinition) => void;
  /** Heading shown above the list, e.g. "Business Ecosystem". */
  label?: string;
  className?: string;
}

/** Lets the current admin quickly jump between related NovaCore applications (OMS, CMS, ...). Applications are entirely consumer-supplied — nothing here is hard-coded. */
export function ApplicationSwitcher({ applications, currentId, onSelect, label = "Switch application", className }: ApplicationSwitcherProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const current = applications.find((app) => app.id === currentId) ?? applications[0];
  if (!current) return null;

  return (
    <>
      <MuiBox
        component="button"
        type="button"
        className={className}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: "none",
          background: "none",
          cursor: "pointer",
          borderRadius: 1.5,
          py: 0.75,
          pl: 0.5,
          pr: 1,
          fontFamily: "inherit",
          color: "text.primary",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ApplicationMark application={current} />
        <MuiTypography variant="body2" sx={{ fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {current.shortName ?? current.name}
        </MuiTypography>
        <UnfoldMoreIcon fontSize="small" sx={{ color: "text.secondary" }} />
      </MuiBox>
      <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} slotProps={{ paper: { sx: { width: 288 } } }}>
        <MuiTypography
          variant="caption"
          sx={{ display: "block", px: 2, pt: 1, pb: 0.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "text.secondary" }}
        >
          {label}
        </MuiTypography>
        {applications.map((app) => (
          <MuiMenuItem
            key={app.id}
            onClick={() => {
              onSelect?.(app);
              setAnchorEl(null);
            }}
            sx={{ alignItems: "flex-start", gap: 1.25, py: 1 }}
          >
            <ApplicationMark application={app} />
            <MuiListItemText
              primary={app.name}
              secondary={app.description}
              slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } }, secondary: { sx: { fontSize: 12 } } }}
            />
            {app.id === current.id ? <CheckIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} /> : null}
          </MuiMenuItem>
        ))}
      </MuiMenu>
    </>
  );
}

function ApplicationMark({ application }: { application: ApplicationDefinition }) {
  if (application.logo) return <>{application.logo}</>;
  return (
    <MuiBox
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: 24,
        height: 24,
        borderRadius: 1,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        bgcolor: application.accent ?? "primary.main",
      }}
    >
      {application.icon ?? (application.shortName ?? application.name).slice(0, 2).toUpperCase()}
    </MuiBox>
  );
}
