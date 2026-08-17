import { vi as foundationVi } from "@novacore/frontend-foundation";
import type { en } from "../en";
import { accessControlNavigation, assignment, permissions, positions, roles, userPermissions } from "./access-control";
import { accessDenied } from "./access-denied";
import { columns } from "./columns";
import { filter } from "./filter";
import { pagination } from "./pagination";
import { sort } from "./sort";
import { states } from "./states";
import { userProfile } from "./user-profile";

/** The Vietnamese translation resource. Shape-checked against `typeof en` — see `../en/index.ts`. */
export const vi = {
  common: foundationVi.common,
  filter,
  sort,
  pagination,
  columns,
  states,
  accessDenied,
  userProfile,
  accessControlNavigation,
  permissions,
  roles,
  positions,
  assignment,
  userPermissions,
} as const satisfies typeof en;
