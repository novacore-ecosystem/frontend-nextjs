import type { userProfile as enUserProfile } from "../en/user-profile";

/** Vietnamese translation of `resources/en/user-profile.ts`. Kept shape-complete via `satisfies typeof enUserProfile`. */
export const userProfile = {
  logout: "Đăng xuất",
} as const satisfies typeof enUserProfile;
