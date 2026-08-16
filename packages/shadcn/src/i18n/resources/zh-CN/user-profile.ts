import type { userProfile as enUserProfile } from "../en/user-profile";

/** Simplified Chinese translation of `resources/en/user-profile.ts`. Kept shape-complete via `satisfies typeof enUserProfile`. */
export const userProfile = {
  logout: "退出登录",
} as const satisfies typeof enUserProfile;
