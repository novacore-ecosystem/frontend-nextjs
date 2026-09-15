import { vi as foundationVi } from "@novacore/frontend-foundation";
import type { en } from "../en";
import {
  accessControlNavigation,
  assignment,
  auditLog,
  permissions,
  positions,
  quickReview,
  roleAssignment,
  roleEditor,
  roles,
  userAuthorizationDetail,
  userPermissions,
} from "./access-control";
import { accessDenied } from "./access-denied";
import { columns } from "./columns";
import { filter } from "./filter";
import { notifications } from "./notifications";
import { pagination } from "./pagination";
import { profile } from "./profile";
import { registrationDefaults } from "./registration-defaults";
import { sort } from "./sort";
import { states } from "./states";
import { tenantSelector } from "./tenant-selector";
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
  profile,
  tenantSelector,
  notifications,
  accessControlNavigation,
  permissions,
  roles,
  roleEditor,
  positions,
  assignment,
  roleAssignment,
  userPermissions,
  userAuthorizationDetail,
  auditLog,
  quickReview,
  registrationDefaults,
} as const satisfies typeof en;
