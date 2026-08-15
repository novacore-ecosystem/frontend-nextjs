"use client";

import * as React from "react";
import { Button, type ButtonProps } from "../actions/button";
import { usePermission } from "./use-permission";

export interface PermissionButtonProps extends ButtonProps {
  permission: string | string[];
  /** `"any"` (default) requires one of `permission`; `"all"` requires every one. Ignored for a single string. */
  mode?: "any" | "all";
}

/** `Button` that renders nothing when the current actor lacks `permission` — sugar over `<PermissionGate><Button/></PermissionGate>` for the common action-button case. */
export function PermissionButton({ permission, mode = "any", ...buttonProps }: PermissionButtonProps) {
  const { canAny, canAll } = usePermission();

  const required = Array.isArray(permission) ? permission : [permission];
  const allowed = mode === "all" ? canAll(required) : canAny(required);

  if (!allowed) return null;
  return <Button {...buttonProps} />;
}
