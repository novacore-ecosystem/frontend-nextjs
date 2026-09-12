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
const { session, loading, error, login, logout, refreshToken, forgotPassword, resendEmail, register, clearError } =
  useAuth(httpClient, { locale, tenantTranslations, onSessionChange });
```

- **`session: AuthSession | null`** — the current in-memory `{ accessToken, refreshToken?,
  expiresAt? }`, set by `login`/`refreshToken`, cleared by `logout`. This hook never persists it
  anywhere (no `localStorage`, no cookie) — wire `onSessionChange` to whatever storage/token
  provider your app already uses, e.g. the same store your `HttpClientOptions.tokenProvider`
  reads from.
- **`loading`/`error`** — shared across every action below (a login/register/forgot-password
  screen only ever has one in flight at a time). `error` is always the result of
  `translateError()` — never a raw `HttpError.code` or an untranslated backend message.
- **`login`/`refreshToken`/`register`** resolve to the response, or `null` on failure (check
  `error`). **`logout`/`forgotPassword`/`resendEmail`** resolve to a boolean.
- `logout()`/`refreshToken()` reuse the current `session.refreshToken` when the request argument
  is omitted.

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
