"use client";

import {
  AuthEndpoints,
  HttpError,
  translateError,
  type AuthSession,
  type ForgotPasswordRequest,
  type HttpClient,
  type Locale,
  type LoginRequest,
  type LogoutRequest,
  type RefreshTokenRequest,
  type RegisterRequest,
  type RegisterResponse,
  type ResendEmailRequest,
  type TranslationBundle,
} from "@novacore/frontend-foundation";
import * as React from "react";

export interface UseAuthOptions {
  /** Locale error messages resolve in, forwarded to `translateError()`. Defaults to the platform default locale — pass the active `I18nProvider`'s `useTranslation().locale` to keep auth errors consistent with the rest of the app. */
  locale?: Locale;
  /** Tenant-specific error message overrides, forwarded to `translateError()` — same shape as `I18nProvider`'s `tenantTranslations`. */
  tenantTranslations?: TranslationBundle;
  /** Called whenever the in-memory session changes: after a successful `login`/`refreshToken` (with the new session) and after `logout` (with `null`). Wire this to wherever your app actually keeps the token (memory, a cookie, `usePersistentState`, the same store your `HttpClientOptions.tokenProvider` reads from) — this hook itself never touches storage. */
  onSessionChange?: (session: AuthSession | null) => void;
}

export interface UseAuthResult {
  /** The current in-memory session, or `null` when signed out. Not persisted by this hook itself — see `onSessionChange`. */
  session: AuthSession | null;
  /** `true` while any action below is in flight. Shared across actions since a login/register screen only ever has one in flight at a time — track your own per-field state if you need finer granularity. */
  loading: boolean;
  /** Localized message for the most recently failed action, via `translateError()` — never a raw backend code, and never an untranslated message. `null` after a successful action or `clearError()`. */
  error: string | null;
  clearError: () => void;
  login: (request: LoginRequest) => Promise<AuthSession | null>;
  /** Resolves `true` on success (including "already logged out") and `false` on failure — check `error` for why. */
  logout: (request?: LogoutRequest) => Promise<boolean>;
  /** Reuses the current session's `refreshToken` when `request` is omitted. */
  refreshToken: (request?: RefreshTokenRequest) => Promise<AuthSession | null>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<boolean>;
  resendEmail: (request: ResendEmailRequest) => Promise<boolean>;
  register: (request: RegisterRequest) => Promise<RegisterResponse | null>;
}

/** Normalizes whatever `HttpClient.execute` throws into `translateError()`'s input shape — the one place this hook touches `HttpError` internals. */
function toTranslatableError(err: unknown): { messageCode?: string | null; message?: string } {
  if (err instanceof HttpError) return { messageCode: err.code, message: err.message };
  if (err instanceof Error) return { message: err.message };
  return { message: String(err) };
}

/**
 * Session/auth-action hook built directly on `@novacore/frontend-foundation`'s new
 * `AuthEndpoints` + the shared `HttpClient` — the intended shared replacement for the
 * bespoke Zustand session store and hand-rolled error mapping nova-console/nova-wcm each
 * currently maintain independently (see `.wolf/STATUS.md`; migrating those apps onto this
 * hook is a separate follow-up task, not done here).
 *
 * Every failure is resolved to a localized string via `translateError()` before it ever
 * reaches `error` — callers never see a raw `HttpError.code`/backend message. Loading/error/
 * data state is deliberately simple (one shared `loading`/`error`, plus `session` as the one
 * piece of durable data this hook tracks) since a login/register/forgot-password screen only
 * ever has one action in flight at a time.
 *
 * This hook does **not** persist the session anywhere (no `localStorage`, no cookie) — that
 * decision varies too much per application's security posture to standardize here. Wire
 * `onSessionChange` to whatever storage/token-provider your app already uses.
 *
 * ```tsx
 * const auth = useAuth(httpClient, { locale, onSessionChange: setStoredSession });
 * await auth.login({ usernameOrEmail, password });
 * ```
 */
export function useAuth(httpClient: HttpClient, options: UseAuthOptions = {}): UseAuthResult {
  const { locale, tenantTranslations, onSessionChange } = options;
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const sessionRef = React.useRef<AuthSession | null>(session);
  sessionRef.current = session;

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

  const login = React.useCallback(
    (request: LoginRequest) =>
      run(async () => {
        const result = await httpClient.execute(AuthEndpoints.login, request);
        updateSession(result);
        return result;
      }),
    [httpClient, run, updateSession],
  );

  const logout = React.useCallback(
    async (request?: LogoutRequest) => {
      const result = await run(async () => {
        await httpClient.execute(AuthEndpoints.logout, {
          refreshToken: request?.refreshToken ?? sessionRef.current?.refreshToken,
        });
        updateSession(null);
      });
      return result !== null;
    },
    [httpClient, run, updateSession],
  );

  const refreshToken = React.useCallback(
    (request?: RefreshTokenRequest) =>
      run(async () => {
        const result = await httpClient.execute(AuthEndpoints.refreshToken, {
          refreshToken: request?.refreshToken ?? sessionRef.current?.refreshToken,
        });
        updateSession(result);
        return result;
      }),
    [httpClient, run, updateSession],
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
    (request: RegisterRequest) => run(() => httpClient.execute(AuthEndpoints.register, request)),
    [httpClient, run],
  );

  const clearError = React.useCallback(() => setError(null), []);

  return React.useMemo(
    () => ({ session, loading, error, clearError, login, logout, refreshToken, forgotPassword, resendEmail, register }),
    [session, loading, error, clearError, login, logout, refreshToken, forgotPassword, resendEmail, register],
  );
}
