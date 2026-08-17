"use client";

import { PermissionAssignment, type PermissionAssignmentProps } from "./permission-assignment";

export interface RolePermissionAssignmentProps extends Omit<PermissionAssignmentProps, "subjectType" | "subjectId"> {
  roleId: string;
}

/** `<PermissionAssignment subjectType="role" />` sugar — see section 6/7. */
export function RolePermissionAssignment({ roleId, ...props }: RolePermissionAssignmentProps) {
  return <PermissionAssignment subjectType="role" subjectId={roleId} {...props} />;
}
