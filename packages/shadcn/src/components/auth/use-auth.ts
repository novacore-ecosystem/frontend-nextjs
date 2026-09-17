"use client";

import {
  AuthEndpoints,
  HttpError,
  translateError,
  UserEndpoints,
  type AuthSession,
  type ConfirmEmailRequest,
  type ForgotPasswordRequest,
  type HttpClient,
  type Locale,
  type LoginRequest,
  type RegisterRequest,
  type ResendEmailRequest,
  type TranslationBundle,
} from "@novacore/frontend-foundation";
import * as React from "react";

export interface UseAuthOptions {
  /** Locale error messages resolve in, forwarded to `translateError()`. Defaults to the platform default locale — pass the active `I18nProvider`'s `useTranslation().locale` to keep auth errors consistent with the rest of the app. */
  locale?: Locale;
  /** Tenant-specific error message overrides, forwarded to `translateError()` — same shape as `I18nProvider`'s `tenantTranslations`. */
  tenantTranslations?: TranslationBundle;
  /** Called whenever the in-memory session changes: after a successful `login`/`refreshToken` (with the new session) and after `logout` (with `null`). Wire this to wherever your app already tracks "is there a user" (a Zustand store, React context, `usePersistentState`) — this hook itself never touches storage, and there is no token to persist (see `AuthSession`'s doc comment). */
  onSessionChange?: (session: AuthSession | null) => void;
  /** Called after a successful `login`/`refreshToken` with the tenant's current Bootstrap Version (`null` for Root) — the response body's only field (see `AuthEndpoints`'s module doc comment in `@novacore/frontend-foundation`). Wire this to `BootstrapRefreshCoordinator.refreshBootstrap(version)` so a stale locally-cached Bootstrap is caught immediately after any auth event, without waiting on a SignalR round trip. */
  onBootstrapVersion?: (version: number | null) => void;
}

export interface UseAuthResult {
  /** The current session, or `null` when signed out. Not persisted by this hook itself — see `onSessionChange`. */
  session: AuthSession | null;
  /** `true` while any action below is in flight. Shared across actions since a login/register/forgot-password screen only ever has one in flight at a time — track your own per-field state if you need finer granularity. */
  loading: boolean;
  /** Localized message for the most recently failed action, via `translateError()` — never a raw backend code, and never an untranslated message. `null` after a successful action or `clearError()`. */
  error: string | null;
  clearError: () => void;
  login: (request: LoginRequest) => Promise<AuthSession | null>;
  /** No request — the backend reads the refresh-token cookie automatically. Resolves `true` on success (including "already logged out") and `false` on failure — check `error` for why. */
  logout: () => Promise<boolean>;
  /** No request — same cookie-carried refresh token as `logout`. */
  refreshToken: () => Promise<AuthSession | null>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<boolean>;
  resendEmail: (request: ResendEmailRequest) => Promise<boolean>;
  /** The backend issues no tokens on register — a successful call just means the account was created and a verification email dispatched, never an authenticated session. Follow up with `confirmEmail` once the user has the link. */
  register: (request: RegisterRequest) => Promise<boolean>;
  /** Completes the token-based email-verification link from `register`/`resendEmail`'s dispatched email. */
  confirmEmail: (request: ConfirmEmailRequest) => Promise<boolean>;
}

/** Normalizes whatever `HttpClient.execute` throws into `translateError()`'s input shape — the one place this hook touches `HttpError` internals. */
function toTranslatableError(err: unknown): { messageCode?: string | null; message?: string } {
  if (err instanceof HttpError) return { messageCode: err.code, message: err.message };
  if (err instanceof Error) return { message: err.message };
  return { message: String(err) };
}

/**
 * Session/auth-action hook built directly on `@novacore/frontend-foundation`'s `AuthEndpoints` +
 * `UserEndpoints.getMe` + the shared `HttpClient` — the intended shared replacement for the
 * bespoke Zustand session store and hand-rolled error mapping nova-console/nova-wcm each
 * currently maintain independently (see `.wolf/STATUS.md`; migrating those apps onto this hook
 * is a separate follow-up task, not done here).
 *
 * **The backend issues no bearer token anywhere** — `login`/`refreshToken` set `AccessToken`/
 * `RefreshToken` as HTTP-only cookies (never visible to JavaScript); the response body carries
 * only the tenant's current Bootstrap Version (see `onBootstrapVersion`). So `session` here is
 * not a token pair: on a successful `login`/`refreshToken`,
 * this hook fetches the current user (`UserEndpoints.getMe`) and that becomes the session. Your
 * `HttpClient` must be configured with `withCredentials: true` (`HttpClientOptions`) for the
 * cookies to actually be sent/received, and with `X-Tenant-Client-Key`/`X-App-Key` as default
 * headers where your deployment needs them (see `AuthEndpoints`'s module doc comment in
 * `@novacore/frontend-foundation` — these are per-deployment constants, not per-call request
 * fields).
 *
 * Every failure is resolved to a localized string via `translateError()` before it ever reaches
 * `error` — callers never see a raw `HttpError.code` or backend message. Loading/error/data state
 * is deliberately simple (one shared `loading`/`error`, plus `session` as the one piece of
 * durable data this hook tracks) since a login/register/forgot-password screen only ever has one
 * action in flight at a time.
 *
 * ```tsx
 * const auth = useAuth(httpClient, { locale, onSessionChange: setIsAuthenticated });
 * await auth.login({ email, password });
 * ```
 */
export function useAuth(httpClient: HttpClient, options: UseAuthOptions = {}): UseAuthResult {
  const { locale, tenantTranslations, onSessionChange, onBootstrapVersion } = options;
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const updateSession = React.useCallback(
    (next: AuthSession | null) => {
      setSession(next);
      onSessionChange?.(next);
    },
    [onSessionChange],
  );

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

  /** Shared by `login`/`refreshToken` — the backend confirms the cookie session but never returns who it belongs to, so both fetch the profile themselves. */
  const loadSession = React.useCallback(async () => {
    const user = await httpClient.execute(UserEndpoints.getMe);
    const next: AuthSession = { user };
    updateSession(next);
    return next;
  }, [httpClient, updateSession]);

  const login = React.useCallback(
    (request: LoginRequest) =>
      run(async () => {
        const { version } = await httpClient.execute(AuthEndpoints.login, request);
        onBootstrapVersion?.(version);
        return loadSession();
      }),
    [httpClient, run, loadSession, onBootstrapVersion],
  );

  const logout = React.useCallback(async () => {
    const result = await run(async () => {
      await httpClient.execute(AuthEndpoints.logout);
      updateSession(null);
    });
    return result !== null;
  }, [httpClient, run, updateSession]);

  const refreshToken = React.useCallback(
    () =>
      run(async () => {
        const { version } = await httpClient.execute(AuthEndpoints.refreshToken);
        onBootstrapVersion?.(version);
        return loadSession();
      }),
    [httpClient, run, loadSession, onBootstrapVersion],
  );

  const forgotPassword = React.useCallback(
    async (request: ForgotPasswordRequest) => {
      const result = await run(() => httpClient.execute(AuthEndpoints.forgotPassword, request));
      return result !== null;
    },
    [httpClient, run],
  );

  const resendEmail = React.useCallback(
    async (request: ResendEmailRequest) => {
      const result = await run(() => httpClient.execute(AuthEndpoints.resendEmail, request));
      return result !== null;
    },
    [httpClient, run],
  );

  const register = React.useCallback(
    async (request: RegisterRequest) => {
      const result = await run(() => httpClient.execute(AuthEndpoints.register, request));
      return result !== null;
    },
    [httpClient, run],
  );

  const confirmEmail = React.useCallback(
    async (request: ConfirmEmailRequest) => {
      const result = await run(() => httpClient.execute(AuthEndpoints.confirmEmail, request));
      return result !== null;
    },
    [httpClient, run],
  );

  const clearError = React.useCallback(() => setError(null), []);

  return React.useMemo(
    () => ({
      session,
      loading,
      error,
      clearError,
      login,
      logout,
      refreshToken,
      forgotPassword,
      resendEmail,
      register,
      confirmEmail,
    }),
    [session, loading, error, clearError, login, logout, refreshToken, forgotPassword, resendEmail, register, confirmEmail],
  );
}
