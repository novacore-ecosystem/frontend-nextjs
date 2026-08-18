"use client";

import { RoleAssignment, type RoleAssignmentProps } from "./role-assignment";

export interface PositionRoleAssignmentProps extends Omit<RoleAssignmentProps, "subjectType" | "subjectId"> {
  positionId: string;
}

/** `<RoleAssignment subjectType="position" />` sugar — Position's Roles tab. */
export function PositionRoleAssignment({ positionId, ...props }: PositionRoleAssignmentProps) {
  return <RoleAssignment subjectType="position" subjectId={positionId} {...props} />;
}
