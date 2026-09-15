# Auth & User Profile

Two React hooks — `useAuth` and `useUserProfile` — built directly on
`@novacore/frontend-foundation`'s new `AuthEndpoints`/`UserEndpoints` plus the shared
`HttpClient`. They're the intended shared replacement for the bespoke Zustand session store and
hand-rolled backend-error-message mapping nova-console/nova-wcm each currently maintain
independently — migrating those apps onto these hooks is a separate follow-up task, not covered
by adding the hooks themselves.

```tsx
import { useAuth, useUserProfile } from "@novacore/frontend-next-shadcn";

const auth = useAuth(httpClient, { locale, onSessionChange: setStoredSession });
const profile = useUserProfile(httpClient, { locale });
```

## Why a plain hook, not a Provider/service adapter

Every other data-backed module in this package (Access Control, User Profile's existing
`UserProfileService`) is a **service adapter** the host application implements against its own
backend, because there's no universal shape for "how does your app authenticate" or "what does
your user object look like." `useAuth`/`useUserProfile` are different: they assume your backend
matches the shape `@novacore/frontend-foundation`'s new `AuthEndpoints`/`UserEndpoints` declare,
and call `httpClient.execute(...)` directly — no adapter interface in between. If your backend's
actual routes/fields differ, either adjust the foundation's endpoint definitions (they're
documented there as forward-looking design, not yet backend-audited — see
`@novacore/frontend-foundation`'s `src/auth`/`src/user` doc comments) or don't use these hooks at
all and keep your own adapter; there's no partial-match escape hatch.

## `useAuth`

```tsx
const { session, loading, error, login, logout, refreshToken, forgotPassword, resendEmail, register, confirmEmail, clearError } =
  useAuth(httpClient, { locale, tenantTranslations, onSessionChange });
```

**The backend issues no bearer token anywhere** — confirmed by a full audit of `Auth.API`
(2026-09-15): `login`/`refreshToken` set `AccessToken`/`RefreshToken` as HTTP-only cookies and
return an empty response body, never a token JavaScript can read. So:

- **`session: AuthSession | null`** — now just `{ user: UserProfile }`. A successful `login`/
  `refreshToken` fetches the current user (`UserEndpoints.getMe`) and that becomes the session;
  there is no token to hold. `null` when signed out. This hook never persists it anywhere (no
  `localStorage`, no cookie — the browser already holds the real session via its cookies) — wire
  `onSessionChange` to wherever your app tracks "is there a user" (a Zustand store, React
  context).
- Your `HttpClient` must be constructed with `withCredentials: true` for the cookies to actually
  flow, and with `X-Tenant-Client-Key`/`X-App-Key` as default headers where your deployment needs
  them (see `AuthEndpoints`'s module doc comment in `@novacore/frontend-foundation` — these are
  per-deployment constants, not per-call request fields, since the backend reads them as headers,
  not JSON body fields).
- **`loading`/`error`** — shared across every action below (a login/register/forgot-password
  screen only ever has one in flight at a time). `error` is always the result of
  `translateError()` — never a raw `HttpError.code` or an untranslated backend message.
- **`login`/`refreshToken`** resolve to the new `session`, or `null` on failure (check `error`).
  **`logout`/`forgotPassword`/`resendEmail`/`register`/`confirmEmail`** resolve to a boolean —
  none of them return meaningful response data on the real backend.
- `logout()`/`refreshToken()` take no arguments — the refresh token is a cookie the browser sends
  automatically, never held client-side.
- `register()` creates the account and dispatches a verification email, but issues no session —
  follow up with `confirmEmail()` once the user has the emailed link, then `login()`.
- A login attempt against an account whose email isn't confirmed fails with
  `MessageCode.EmailNotVerified` ("704") — `translateError()` already resolves this to a
  localized message; offer a `resendEmail({ email, purpose: "EmailVerification" })` action from
  that error state rather than just showing the message.

## `useUserProfile`

```tsx
const { profile, detail, effectivePermissions, loading, error, refresh, loadDetail, loadEffectivePermissions, updateProfile, changePassword, resetPassword } =
  useUserProfile(httpClient, { locale, autoLoad: true });
```

- **`profile`** — the current user's own profile (`UserEndpoints.getMe`), fetched automatically
  on mount unless `autoLoad: false`. Its shape (`UserProfile`) deliberately mirrors this
  package's existing `UserProfileData` (`./user-profile` module) field-for-field, so a
  `UserProfileService` adapter for a backend matching `UserEndpoints` is a thin pass-through —
  or skip `UserProfilePage` entirely and build a custom screen straight off this hook.
- **`detail`** — a (possibly different) user's detail via `loadDetail(id?)`; omitting `id`
  targets the currently loaded `profile.id` (view-your-own-detail shorthand).
- **`effectivePermissions`** — `loadEffectivePermissions()` calls the backend-confirmed
  `GET /profiles/current/detail` (`CurrentUserAuthorization` — roles + permissions). Per that
  type's own doc comment, this is a **UI-only** signal (e.g. conditionally rendering navigation),
  never a substitute for server-side authorization.
- **`updateProfile`** updates `profile` in place with the response on success.
- **`changePassword`** (requires the current password) and **`resetPassword`** (completes a
  `useAuth().forgotPassword()` email flow, no current password needed) both resolve to a boolean.

## Error translation

Both hooks resolve every failure through `@novacore/frontend-foundation`'s `translateError()`
before it reaches `error` — the full fallback chain (code -> `ErrorDefinition` -> i18n key ->
tenant override -> platform translation -> `defaultMessage` -> raw backend message -> generic
fallback) is documented on `translateError` itself. Pass `locale`/`tenantTranslations` matching
your mounted `I18nProvider` (typically `useTranslation().locale`) so auth/profile errors read in
the same language as the rest of your app.
