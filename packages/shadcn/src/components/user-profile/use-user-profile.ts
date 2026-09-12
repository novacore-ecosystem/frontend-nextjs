"use client";

import {
  HttpError,
  translateError,
  UserEndpoints,
  type ChangePasswordRequest,
  type CurrentUserAuthorization,
  type HttpClient,
  type Locale,
  type ResetPasswordRequest,
  type TranslationBundle,
  type UpdateProfileRequest,
  type UserDetail,
  type UserProfile,
} from "@novacore/frontend-foundation";
import * as React from "react";

export interface UseUserProfileOptions {
  /** Locale error messages resolve in, forwarded to `translateError()`. Defaults to the platform default locale. */
  locale?: Locale;
  /** Tenant-specific error message overrides, forwarded to `translateError()`. */
  tenantTranslations?: TranslationBundle;
  /** Fetches the current user's own profile (`UserEndpoints.getMe`) automatically on mount. Defaults to `true`; pass `false` to fetch on demand via `refresh()` instead (e.g. only after the user opens a profile page). */
  autoLoad?: boolean;
}

export interface UseUserProfileResult {
  /** The current user's own profile, from `UserEndpoints.getMe` — populated automatically unless `autoLoad: false`. */
  profile: UserProfile | null;
  /** Read-only detail for a given user id, from `loadDetail()` — distinct from `profile` since it may be a different user's (e.g. an admin viewing someone else's detail). */
  detail: UserDetail | null;
  /** The current user's effective roles/permissions, from `loadEffectivePermissions()` — a **UI-only** signal (see `CurrentUserAuthorization`'s own doc comment), never a substitute for server-side authorization. */
  effectivePermissions: CurrentUserAuthorization | null;
  loading: boolean;
  /** Localized message for the most recently failed action, via `translateError()`. `null` after a successful action or `clearError()`. */
  error: string | null;
  clearError: () => void;
  /** Re-fetches `profile` (`UserEndpoints.getMe`). Also what `autoLoad` calls internally on mount. */
  refresh: () => Promise<UserProfile | null>;
  /** Fetches detail for `id`, or for the currently loaded `profile.id` when `id` is omitted (view-your-own-detail shorthand). */
  loadDetail: (id?: string) => Promise<UserDetail | null>;
  loadEffectivePermissions: () => Promise<CurrentUserAuthorization | null>;
  /** On success, also updates `profile` in place with the response. */
  updateProfile: (patch: UpdateProfileRequest) => Promise<UserProfile | null>;
  changePassword: (request: ChangePasswordRequest) => Promise<boolean>;
  /** Completing a forgot-password flow (see `useAuth`'s `forgotPassword`) — does not require an authenticated session. */
  resetPassword: (request: ResetPasswordRequest) => Promise<boolean>;
}

function toTranslatableError(err: unknown): { messageCode?: string | null; message?: string } {
  if (err instanceof HttpError) return { messageCode: err.code, message: err.message };
  if (err instanceof Error) return { message: err.message };
  return { message: String(err) };
}

/**
 * Data hook for the current user's own profile, built directly on
 * `@novacore/frontend-foundation`'s new `UserEndpoints` + the shared `HttpClient`. A lower-level
 * alternative to this package's existing `UserProfileService`/`UserProfilePage` pair
 * (`./types`/`./UserProfilePage`) — if your backend matches `UserEndpoints`'s shape, you can
 * implement `UserProfileService` as a thin wrapper over this hook's `profile`/`updateProfile`,
 * or use this hook directly without `UserProfilePage` for a fully custom screen.
 *
 * Every failure is resolved to a localized string via `translateError()` before it reaches
 * `error` — never a raw backend code or an untranslated message.
 */
export function useUserProfile(httpClient: HttpClient, options: UseUserProfileOptions = {}): UseUserProfileResult {
  const { locale, tenantTranslations, autoLoad = true } = options;
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [detail, setDetail] = React.useState<UserDetail | null>(null);
  const [effectivePermissions, setEffectivePermissions] = React.useState<CurrentUserAuthorization | null>(null);
  const [loading, setLoading] = React.useState(Boolean(autoLoad));
  const [error, setError] = React.useState<string | null>(null);
  const profileRef = React.useRef<UserProfile | null>(profile);
  profileRef.current = profile;

  const run = React.useCallback(
    async function run<T>(action: () => Promise<T>): Promise<T | null> {
      setLoading(true);
      setError(null);
      try {
        return await action();
      } catch (err) {
        setError(translateError(toTranslatableError(err), { locale, tenantOverrides: tenantTranslations }));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [locale, tenantTranslations],
  );

  const refresh = React.useCallback(
    () =>
      run(async () => {
        const result = await httpClient.execute(UserEndpoints.getMe);
        setProfile(result);
        return result;
      }),
    [httpClient, run],
  );

  const loadDetail = React.useCallback(
    (id?: string) =>
      run(async () => {
        const targetId = id ?? profileRef.current?.id;
        if (!targetId) throw new Error("useUserProfile.loadDetail: no id supplied and no profile loaded yet.");
        const result = await httpClient.execute(UserEndpoints.getById, { id: targetId });
        setDetail(result);
        return result;
      }),
    [httpClient, run],
  );

  const loadEffectivePermissions = React.useCallback(
    () =>
      run(async () => {
        const result = await httpClient.execute(UserEndpoints.getEffectivePermissions);
        setEffectivePermissions(result);
        return result;
      }),
    [httpClient, run],
  );

  const updateProfile = React.useCallback(
    (patch: UpdateProfileRequest) =>
      run(async () => {
        const result = await httpClient.execute(UserEndpoints.updateProfile, patch);
        setProfile(result);
        return result;
      }),
    [httpClient, run],
  );

  const changePassword = React.useCallback(
    async (request: ChangePasswordRequest) => {
      const result = await run(() => httpClient.execute(UserEndpoints.changePassword, request));
      return result !== null;
    },
    [httpClient, run],
  );

  const resetPassword = React.useCallback(
    async (request: ResetPasswordRequest) => {
      const result = await run(() => httpClient.execute(UserEndpoints.resetPassword, request));
      return result !== null;
    },
    [httpClient, run],
  );

  const clearError = React.useCallback(() => setError(null), []);

  React.useEffect(() => {
    if (autoLoad) void refresh();
    // Only ever auto-loads once on mount, regardless of later `refresh`/`httpClient` identity
    // changes — re-running on every `refresh` identity change would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.useMemo(
    () => ({
      profile,
      detail,
      effectivePermissions,
      loading,
      error,
      clearError,
      refresh,
      loadDetail,
      loadEffectivePermissions,
      updateProfile,
      changePassword,
      resetPassword,
    }),
    [
      profile,
      detail,
      effectivePermissions,
      loading,
      error,
      clearError,
      refresh,
      loadDetail,
      loadEffectivePermissions,
      updateProfile,
      changePassword,
      resetPassword,
    ],
  );
}
