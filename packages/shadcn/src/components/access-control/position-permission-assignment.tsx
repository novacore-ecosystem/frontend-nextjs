"use client";

import { PermissionAssignment, type PermissionAssignmentProps } from "./permission-assignment";

export interface PositionPermissionAssignmentProps extends Omit<PermissionAssignmentProps, "subjectType" | "subjectId"> {
  positionId: string;
}

/** `<PermissionAssignment subjectType="position" />` sugar — see section 9. */
export function PositionPermissionAssignment({ positionId, ...props }: PositionPermissionAssignmentProps) {
  return <PermissionAssignment subjectType="position" subjectId={positionId} {...props} />;
}
