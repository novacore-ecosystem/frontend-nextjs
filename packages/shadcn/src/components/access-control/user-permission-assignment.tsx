"use client";

import type { CriteriaFilter } from "@novacore/frontend-foundation";
import * as React from "react";
import { useTranslation } from "../../i18n";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import { DataTable, fromPaginatedResult, type DataTableColumn } from "../admin/data-table";
import { HowTo } from "../admin/how-to";
import { AdminPage, PageHeader, Toolbar } from "../admin/page";
import { ConfirmDialog } from "../composed/confirm-dialog";
import { SearchInput } from "../composed/search-input";
import { Button } from "../ui/button";
import { useAccessControlServices } from "./access-control-provider";
import { PermissionAssignment } from "./permission-assignment";
import { PermissionTree } from "./permission-tree";
import { resolvePermissionCatalog } from "./permission-utils";
import type { PermissionDefinition, SubjectOption, SubjectSearchProvider } from "./types";

const PAGE_SIZE = 10;

export interface UserPermissionAssignmentFilterRenderProps {
  filters: CriteriaFilter[];
  onFiltersChange: (filters: CriteriaFilter[]) => void;
}

export interface UserPermissionAssignmentProps {
  /** The application's permission catalog — same one passed to `PermissionManagement`/`RoleManagement`/`PositionManagement`. */
  permissions: PermissionDefinition[];
  /** The application's user/member search adapter — see `SubjectSearchProvider`. Not part of `AccessControlServices`: user/member search varies too much per application to standardize into the shared provider. */
  subjectProvider: SubjectSearchProvider;
  /**
   * Escape hatch for application-specific filter UI (e.g. department/status/tenant dropdowns)
   * without embedding any of that into this module. This component owns the `filters` state and
   * threads it into every `subjectProvider.search()` call; the application only supplies the
   * controls.
   */
  renderFilters?: (props: UserPermissionAssignmentFilterRenderProps) => React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

/**
 * The complete User Permission Assignment page (section 12-21): server-side searchable,
 * paginated user/member selection (one, many, or a dynamically searched group), assigning
 * permissions from the same catalog and `PermissionTree` selector Role/Position assignment use.
 *
 * Deliberately kept out of any User Management page — assigning permissions is an access-control
 * concern, not a user-CRUD concern (see `docs/access-control.md`).
 *
 * Selection semantics: selecting exactly one subject reuses `PermissionAssignment` unchanged —
 * full load-current-state/edit/save, identical to Role/Position. Selecting multiple subjects
 * switches to an **additive grant**: checked permissions are granted on top of each selected
 * subject's existing permissions (fetched individually before saving), never revoking anything
 * a subject already held — a bulk action shouldn't silently take away permissions granted
 * elsewhere.
 */
export function UserPermissionAssignment({
  permissions,
  subjectProvider,
  renderFilters,
  breadcrumb,
  className,
}: UserPermissionAssignmentProps) {
  const { t } = useTranslation();
  const services = useAccessControlServices();

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [filters, setFilters] = React.useState<CriteriaFilter[]>([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [rows, setRows] = React.useState<SubjectOption[]>([]);
  const [totalRows, setTotalRows] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selected, setSelected] = React.useState<Map<string, SubjectOption>>(new Map());
  const [draftPermissionIds, setDraftPermissionIds] = React.useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [granting, setGranting] = React.useState(false);
  const [grantError, setGrantError] = React.useState<string | null>(null);
  const [grantSuccess, setGrantSuccess] = React.useState(false);

  const groups = React.useMemo(() => resolvePermissionCatalog(permissions, t), [permissions, t]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await subjectProvider.search({
        keyword: debouncedQuery || undefined,
        filters,
        page: pageNumber,
        pageSize: PAGE_SIZE,
      });
      const adapted = fromPaginatedResult(result);
      setRows(adapted.data);
      setTotalRows(adapted.pagination.totalRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [subjectProvider, debouncedQuery, filters, pageNumber]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery, filters]);

  function handleSelectedRowIdsChange(ids: string[]) {
    const idSet = new Set(ids);
    setSelected((prev) => {
      const next = new Map(prev);
      for (const row of rows) {
        if (idSet.has(row.id)) next.set(row.id, row);
        else next.delete(row.id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Map());
    setDraftPermissionIds([]);
    setGrantSuccess(false);
  }

  async function handleGrant() {
    setGranting(true);
    setGrantError(null);
    try {
      const subjectIds = [...selected.keys()];
      await Promise.all(
        subjectIds.map(async (subjectId) => {
          const current = await services.assignments.getAssignedPermissions("user", subjectId);
          const union = [...new Set([...current.permissionIds, ...draftPermissionIds])];
          await services.assignments.assignPermissions("user", subjectId, union);
        }),
      );
      setConfirmOpen(false);
      setDraftPermissionIds([]);
      setGrantSuccess(true);
    } catch (err) {
      setGrantError(err instanceof Error ? err.message : String(err));
    } finally {
      setGranting(false);
    }
  }

  const columns: DataTableColumn<SubjectOption>[] = [
    { id: "displayName", header: t("userPermissions.columns.name") },
    {
      id: "secondaryText",
      header: t("userPermissions.columns.secondary"),
      cell: (row) => row.secondaryText ?? "—",
      className: "text-muted-foreground",
    },
  ];

  const selectedIds = React.useMemo(() => rows.filter((row) => selected.has(row.id)).map((row) => row.id), [rows, selected]);
  const selectedCount = selected.size;
  const singleSelectedId = selectedCount === 1 ? [...selected.keys()][0] : undefined;

  return (
    <AdminPage className={className}>
      <PageHeader title={t("userPermissions.title")} description={t("userPermissions.description")} breadcrumb={breadcrumb} />
      <Toolbar>
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("userPermissions.searchPlaceholder")}
          className="max-w-sm"
        />
        {renderFilters?.({ filters, onFiltersChange: setFilters })}
      </Toolbar>

      {selectedCount > 0 ? (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
          <span>{t("userPermissions.selectedCount", { count: selectedCount })}</span>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={clearSelection}>
            {t("userPermissions.clearSelection")}
          </Button>
        </div>
      ) : null}

      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        error={error ?? undefined}
        onRetry={() => void load()}
        emptyMessage={t("userPermissions.empty")}
        pagination={{ pageNumber, pageSize: PAGE_SIZE, totalRows }}
        onPaginationChange={(next) => setPageNumber(next.pageNumber)}
        selectable
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={handleSelectedRowIdsChange}
      />

      {selectedCount === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {t("userPermissions.noneSelected")}
        </p>
      ) : selectedCount === 1 && singleSelectedId ? (
        <PermissionAssignment permissions={permissions} subjectType="user" subjectId={singleSelectedId} />
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-medium">{t("userPermissions.bulk.title", { count: selectedCount })}</h3>
            <p className="text-sm text-muted-foreground">{t("userPermissions.bulk.description")}</p>
          </div>
          <PermissionTree groups={groups} selectedIds={draftPermissionIds} onSelectedIdsChange={setDraftPermissionIds} />
          {grantSuccess ? <p className="text-sm text-primary">{t("userPermissions.bulk.granted")}</p> : null}
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setGrantError(null);
                setGrantSuccess(false);
                setConfirmOpen(true);
              }}
              disabled={draftPermissionIds.length === 0}
            >
              {t("userPermissions.bulk.grant")}
            </Button>
          </div>
        </div>
      )}

      <HowTo title={t("userPermissions.howTo.title")}>
        <p>{t("userPermissions.howTo.whatIs")}</p>
        <p>{t("userPermissions.howTo.singleVsBulk")}</p>
        <p>{t("userPermissions.howTo.notUserManagement")}</p>
      </HowTo>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setGrantError(null);
        }}
        title={t("userPermissions.bulk.confirmTitle")}
        description={t("userPermissions.bulk.confirmDescription", {
          permissionCount: draftPermissionIds.length,
          subjectCount: selectedCount,
        })}
        confirmLabel={t("userPermissions.bulk.confirmButton")}
        loading={granting}
        error={grantError}
        onConfirm={() => void handleGrant()}
      />
    </AdminPage>
  );
}
