/** The authenticated user's own profile — a superset of fields a real Auth/User API may expose. Every field but `id`/`displayName` is optional: a consuming app only fills in what its backend actually returns, and `UserProfilePage` renders each section only when its data is present rather than inventing placeholder values. */
export interface UserProfileData {
  id: string;
  displayName: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  status?: string;
  tenantName?: string;
  roles?: string[];
}

/** What the consuming app's backend actually supports editing — gates which sections `UserProfilePage` renders as editable vs. omits entirely. */
export interface UserProfileCapabilities {
  avatarUpload: boolean;
}

export type UserProfileUpdateInput = Partial<Pick<UserProfileData, "displayName" | "email">>;

/**
 * The consuming application's adapter over its own Auth/User API. Implement this against real
 * endpoints where they exist — see `AccessControlServices` for the same shape of contract this
 * package already uses for Access Control.
 */
export interface UserProfileService {
  getProfile(): Promise<UserProfileData>;
  getCapabilities(): UserProfileCapabilities;
  updateProfile(patch: UserProfileUpdateInput): Promise<UserProfileData>;
  /** Present only when `getCapabilities().avatarUpload` is true. */
  uploadAvatar?(file: File): Promise<{ avatarUrl: string }>;
  removeAvatar?(): Promise<void>;
}
