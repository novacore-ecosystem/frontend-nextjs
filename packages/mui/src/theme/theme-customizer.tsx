"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useClientTheme } from "./client-provider";
import { PRESET_NAMES } from "./tokens";
import type { ThemeDensity, ThemeMode, ThemePresetName, ThemeRadius } from "./types";

const MODES: ThemeMode[] = ["light", "dark", "system"];
const RADII: ThemeRadius[] = ["none", "small", "medium", "large"];
const DENSITIES: ThemeDensity[] = ["comfortable", "compact"];

function chipButtonStyle(active: boolean) {
  return {
    px: 1.5,
    py: 0.5,
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid",
    borderColor: active ? "primary.main" : "divider",
    bgcolor: active ? "primary.main" : "transparent",
    color: active ? "primary.contrastText" : "text.primary",
    cursor: "pointer",
    textTransform: "capitalize" as const,
  };
}

/** Dev/demo control panel for previewing mode, preset, radius, and density live. */
export function ThemeCustomizer() {
  const { config, resolved, setThemeConfig } = useClientTheme();

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Mode
          </Typography>
          <Stack direction="row" spacing={1}>
            {MODES.map((mode) => (
              <Box
                key={mode}
                component="button"
                onClick={() => setThemeConfig((prev) => ({ ...prev, mode }))}
                sx={chipButtonStyle((config.mode ?? "system") === mode)}
              >
                {mode}
              </Box>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Preset
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {(PRESET_NAMES as ThemePresetName[]).map((preset) => (
              <Box
                key={preset}
                component="button"
                onClick={() => setThemeConfig((prev) => ({ ...prev, preset }))}
                sx={chipButtonStyle(resolved.preset === preset)}
              >
                {preset}
              </Box>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Radius
          </Typography>
          <Stack direction="row" spacing={1}>
            {RADII.map((radius) => (
              <Box
                key={radius}
                component="button"
                onClick={() => setThemeConfig((prev) => ({ ...prev, radius }))}
                sx={chipButtonStyle(resolved.radius === radius)}
              >
                {radius}
              </Box>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Density
          </Typography>
          <Stack direction="row" spacing={1}>
            {DENSITIES.map((density) => (
              <Box
                key={density}
                component="button"
                onClick={() => setThemeConfig((prev) => ({ ...prev, density }))}
                sx={chipButtonStyle(resolved.density === density)}
              >
                {density}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
