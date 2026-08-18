"use client";

import * as React from "react";
import { useTranslation } from "../../i18n";
import { HowTo } from "../admin/how-to";
import { AdminPage, PageHeader } from "../admin/page";
import { EmptyState, ErrorState, LoadingState } from "../admin/states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { EffectivePermissions } from "./effective-permissions";
import { PermissionAssignment } from "./permission-assignment";
import { UserRoleAssignment } from "./user-role-assignment";
import type { PermissionDefinition, SubjectDetail, SubjectSearchProvider } from "./types";

export interface UserAuthorizationDetailProps {
  subjectId: string;
  /** The application's permission catalog — same one passed to `PermissionManagement`/`UserPermissionAssignment`. */
  permissions: PermissionDefinition[];
  /** The application's user/member adapter — `getById` backs the header/Overview tab. */
  subjectProvider: SubjectSearchProvider;
  breadcrumb?: React.ReactNode;
  className?: string;
}

/**
 * A complete authorization workspace for one user: profile Overview, Roles, Direct Permissions,
 * and Effective Permissions (what they hold, and why) — a full page (not a `Sheet`), since this
 * is meant to be the canonical place to answer "what can this person do, and through what."
 * Different from `UserPermissionAssignment`'s bulk page, which operates on many users at once and
 * links here for the full single-user picture.
 */
export function UserAuthorizationDetail({
  subjectId,
  permissions,
  subjectProvider,
  breadcrumb,
  className,
}: UserAuthorizationDetailProps) {
  const { t } = useTranslation();
  const [subject, setSubject] = React.useState<SubjectDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await subjectProvider.getById(subjectId);
      setSubject(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [subjectProvider, subjectId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error} onRetry={() => void load()} />;
  if (!subject) return <EmptyState description={t("userAuthorizationDetail.notFound")} />;

  return (
    <AdminPage className={className}>
      <PageHeader title={subject.displayName} description={t("userAuthorizationDetail.description")} breadcrumb={breadcrumb} />

      <Tabs defaultValue="overview" className="flex flex-1 flex-col gap-4">
        <TabsList>
          <TabsTrigger value="overview">{t("userAuthorizationDetail.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="roles">{t("userAuthorizationDetail.tabs.roles")}</TabsTrigger>
          <TabsTrigger value="directPermissions">{t("userAuthorizationDetail.tabs.directPermissions")}</TabsTrigger>
          <TabsTrigger value="effectivePermissions">{t("userAuthorizationDetail.tabs.effectivePermissions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {subject.fields && subject.fields.length > 0 ? (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subject.fields.map((field) => (
                <div key={field.label} className="rounded-lg border border-border p-3">
                  <dt className="text-xs text-muted-foreground">{field.label}</dt>
                  <dd className="text-sm font-medium">{field.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <EmptyState description={t("userAuthorizationDetail.overview.empty")} />
          )}
        </TabsContent>

        <TabsContent value="roles">
          <UserRoleAssignment userId={subjectId} />
        </TabsContent>

        <TabsContent value="directPermissions">
          <PermissionAssignment permissions={permissions} subjectType="user" subjectId={subjectId} />
        </TabsContent>

        <TabsContent value="effectivePermissions">
          <EffectivePermissions permissions={permissions} subjectType="user" subjectId={subjectId} />
        </TabsContent>
      </Tabs>

      <HowTo title={t("userAuthorizationDetail.title")}>
        <p>{t("userPermissions.howTo.whatIs")}</p>
        <p>{t("userAuthorizationDetail.effectivePermissions.description")}</p>
      </HowTo>
    </AdminPage>
  );
}
