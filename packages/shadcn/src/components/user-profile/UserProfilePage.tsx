"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { useTranslation } from "../../i18n";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormActions, FormField } from "../composed/form-field";
import { PageContainer, PageHeader, PageSection } from "../admin/page";
import { ErrorState, LoadingState } from "../admin/states";
import { useUserProfileService } from "./user-profile-provider";
import type { UserProfileData } from "./types";

/**
 * Canonical User Profile page: Personal Information, Avatar (only when the app's adapter
 * supports it), and read-only Account Information — backed by the nearest
 * `<UserProfileProvider service={...}>`. Mount as `<UserProfilePage />`; no props required.
 */
export function UserProfilePage() {
  const { t } = useTranslation();
  const service = useUserProfileService();
  const capabilities = React.useMemo(() => service.getCapabilities(), [service]);

  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [loadState, setLoadState] = React.useState<"loading" | "ready" | "error">("loading");

  const load = React.useCallback(() => {
    setLoadState("loading");
    service
      .getProfile()
      .then((data) => {
        setProfile(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [service]);

  React.useEffect(() => {
    load();
  }, [load]);

  if (loadState === "loading") return <LoadingState label={t("profile.loading")} />;
  if (loadState === "error" || !profile) {
    return <ErrorState title={t("profile.loadErrorTitle")} description={t("profile.loadErrorDescription")} onRetry={load} />;
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader title={t("profile.title")} description={t("profile.description")} />
        <PageSection title={t("profile.personalInfo.title")}>
          <PersonalInformationForm profile={profile} onUpdated={setProfile} />
        </PageSection>
        {capabilities.avatarUpload ? (
          <PageSection title={t("profile.avatar.title")} description={t("profile.avatar.description")}>
            <AvatarEditor profile={profile} onUpdated={setProfile} />
          </PageSection>
        ) : null}
        <PageSection title={t("profile.accountInfo.title")}>
          <AccountInformation profile={profile} />
        </PageSection>
      </div>
    </PageContainer>
  );
}

function PersonalInformationForm({ profile, onUpdated }: { profile: UserProfileData; onUpdated: (data: UserProfileData) => void }) {
  const { t } = useTranslation();
  const service = useUserProfileService();
  const [displayName, setDisplayName] = React.useState(profile.displayName);
  const [email, setEmail] = React.useState(profile.email ?? "");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setDisplayName(profile.displayName);
    setEmail(profile.email ?? "");
  }, [profile.displayName, profile.email]);

  const dirty = displayName.trim() !== profile.displayName || (email.trim() || undefined) !== profile.email;

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await service.updateProfile({ displayName: displayName.trim(), email: email.trim() || undefined });
      onUpdated(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FormField label={t("profile.personalInfo.displayName")} required htmlFor="profile-display-name">
        <Input id="profile-display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      </FormField>
      <FormField label={t("profile.personalInfo.email")} htmlFor="profile-email">
        <Input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormField>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {saved && !dirty ? <p className="text-sm text-muted-foreground">{t("profile.personalInfo.saved")}</p> : null}
      <FormActions>
        <Button onClick={() => void handleSave()} loading={saving} disabled={!dirty || !displayName.trim()}>
          {t("profile.personalInfo.update")}
        </Button>
      </FormActions>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase();
}

function AvatarEditor({ profile, onUpdated }: { profile: UserProfileData; onUpdated: (data: UserProfileData) => void }) {
  const { t } = useTranslation();
  const service = useUserProfileService();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !service.uploadAvatar) return;
    setUploading(true);
    setError(null);
    try {
      const { avatarUrl } = await service.uploadAvatar(file);
      onUpdated({ ...profile, avatarUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!service.removeAvatar) return;
    setUploading(true);
    setError(null);
    try {
      await service.removeAvatar();
      onUpdated({ ...profile, avatarUrl: undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar src={profile.avatarUrl} alt={profile.displayName} fallback={initials(profile.displayName)} className="h-16 w-16" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileChange(event)} />
          <Button type="button" variant="outline" size="sm" loading={uploading} onClick={() => inputRef.current?.click()}>
            <Camera className="mr-1.5 h-3.5 w-3.5" />
            {t("profile.avatar.upload")}
          </Button>
          {profile.avatarUrl && service.removeAvatar ? (
            <Button type="button" variant="ghost" size="sm" disabled={uploading} onClick={() => void handleRemove()}>
              {t("profile.avatar.remove")}
            </Button>
          ) : null}
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function AccountInformation({ profile }: { profile: UserProfileData }) {
  const { t } = useTranslation();
  const rows: Array<[string, string]> = [];
  if (profile.username) rows.push([t("profile.accountInfo.username"), profile.username]);
  if (profile.email) rows.push([t("profile.accountInfo.email"), profile.email]);
  if (profile.status) rows.push([t("profile.accountInfo.status"), profile.status]);
  if (profile.tenantName) rows.push([t("profile.accountInfo.tenant"), profile.tenantName]);
  if (profile.roles?.length) rows.push([t("profile.accountInfo.roles"), profile.roles.join(", ")]);

  if (rows.length === 0) return <p className="text-sm text-muted-foreground">{t("profile.accountInfo.empty")}</p>;

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      {rows.map(([label, value]) => (
        <React.Fragment key={label}>
          <dt className="text-muted-foreground">{label}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
