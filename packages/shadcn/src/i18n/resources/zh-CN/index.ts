import { zhCN as foundationZhCN } from "@novacore/frontend-foundation";
import type { en } from "../en";
import {
  accessControlNavigation,
  assignment,
  permissions,
  positions,
  roleAssignment,
  roles,
  userAuthorizationDetail,
  userPermissions,
} from "./access-control";
import { accessDenied } from "./access-denied";
import { columns } from "./columns";
import { filter } from "./filter";
import { pagination } from "./pagination";
import { profile } from "./profile";
import { sort } from "./sort";
import { states } from "./states";
import { userProfile } from "./user-profile";

/** The Simplified Chinese translation resource. Shape-checked against `typeof en` — see `../en/index.ts`. */
export const zhCN = {
  common: foundationZhCN.common,
  filter,
  sort,
  pagination,
  columns,
  states,
  accessDenied,
  userProfile,
  profile,
  accessControlNavigation,
  permissions,
  roles,
  positions,
  assignment,
  roleAssignment,
  userPermissions,
  userAuthorizationDetail,
} as const satisfies typeof en;
