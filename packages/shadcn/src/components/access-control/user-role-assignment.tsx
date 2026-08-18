"use client";

import { RoleAssignment, type RoleAssignmentProps } from "./role-assignment";

export interface UserRoleAssignmentProps extends Omit<RoleAssignmentProps, "subjectType" | "subjectId"> {
  userId: string;
}

/** `<RoleAssignment subjectType="user" />` sugar — used by `UserAuthorizationDetail`'s Roles tab and `UserPermissionAssignment`'s single-select path. */
export function UserRoleAssignment({ userId, ...props }: UserRoleAssignmentProps) {
  return <RoleAssignment subjectType="user" subjectId={userId} {...props} />;
}
