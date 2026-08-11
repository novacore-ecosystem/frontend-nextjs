"use client";

import UploadIcon from "@mui/icons-material/CloudUpload";
import MuiBox from "@mui/material/Box";
import * as React from "react";
import { Text } from "../typography/text";
import type { NovaSx } from "../../lib/types";

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  sx?: NovaSx;
}

/** Presentational drag/drop + click-to-browse area. Upload transport (to S3, an API, ...) is the application's responsibility. */
export function FileUpload({ onFilesSelected, accept, multiple, label = "Drop files here or click to browse", hint, disabled, className, sx }: FileUploadProps) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    onFilesSelected(Array.from(fileList));
  }

  return (
    <MuiBox
      className={className}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(event.dataTransfer.files);
      }}
      sx={[
        {
          border: "2px dashed",
          borderColor: dragging ? "primary.main" : "divider",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          bgcolor: dragging ? "action.hover" : "transparent",
          transition: "border-color 150ms ease, background-color 150ms ease",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />
      <UploadIcon sx={{ fontSize: 32, color: "text.secondary", mb: 1 }} />
      <Text weight="medium">{label}</Text>
      {hint ? (
        <Text size="bodySmall" color="muted" sx={{ mt: 0.5 }}>
          {hint}
        </Text>
      ) : null}
    </MuiBox>
  );
}
