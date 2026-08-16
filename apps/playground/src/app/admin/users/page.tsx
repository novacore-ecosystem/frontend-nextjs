"use client";

import { Permissions, type CriteriaFilter, type CriteriaSort } from "@novacore/frontend-foundation";
import {
  AdminBreadcrumb,
  AdminPage,
  AdvancedFilter,
  AdvancedSort,
  ColumnVisibility,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  type FilterFieldConfig,
  PageHeader,
  PermissionButton,
  type SortFieldConfig,
  StatusBadge,
} from "@novacore/frontend-next-shadcn";
import * as React from "react";

const FILTER_FIELDS: FilterFieldConfig[] = [
  { field: "name", label: "Name", type: "string", operators: ["eq", "c", "sw"] },
  { field: "email", label: "Email", type: "string", operators: ["eq", "c"] },
  {
    field: "status",
    label: "Status",
    type: "enum",
    operators: ["eq", "ne"],
    options: [
      { value: "active", label: "Active" },
      { value: "invited", label: "Invited" },
      { value: "disabled", label: "Disabled" },
    ],
  },
];

const SORT_FIELDS: SortFieldConfig[] = [
  { field: "name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "status", label: "Status" },
];

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "invited" | "disabled";
}

const USERS: User[] = Array.from({ length: 23 }).map((_, index) => ({
  id: String(index + 1),
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  status: index % 5 === 0 ? "disabled" : index % 3 === 0 ? "invited" : "active",
}));

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", sortable: true },
  { id: "email", header: "Email", sortable: true },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusBadge
        label={row.status}
        tone={row.status === "active" ? "success" : row.status === "invited" ? "info" : "neutral"}
      />
    ),
  },
];

export default function UsersPage() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<CriteriaFilter[]>([]);
  const [sorts, setSorts] = React.useState<CriteriaSort[]>([]);
  const [hiddenColumns, setHiddenColumns] = React.useState<string[]>([]);
  const pageSize = 10;

  const pageRows = USERS.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize);
  const visibleColumns = columns.filter((column) => !hiddenColumns.includes(column.id));

  return (
    <AdminPage>
      <PageHeader
        title="Users"
        description="Demonstrates DataTable plus a permission-gated bulk action — the Viewer persona lacks users:manage, so Delete disappears."
        breadcrumb={<AdminBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Users" }]} />}
      />
      <div className="flex flex-wrap items-center gap-2">
        <AdvancedFilter fields={FILTER_FIELDS} value={filters} onApply={setFilters} />
        <AdvancedSort fields={SORT_FIELDS} value={sorts} onApply={setSorts} />
        <ColumnVisibility
          columns={columns.map((column) => ({ id: column.id, label: String(column.header) }))}
          hidden={hiddenColumns}
          onHiddenChange={setHiddenColumns}
          onClear={() => setHiddenColumns([])}
        />
      </div>
      <DataTable
        data={pageRows}
        columns={visibleColumns}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
        bulkActions={
          <PermissionButton permission={Permissions.Users.Manage} variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
            Delete selected
          </PermissionButton>
        }
        pagination={{ pageNumber, pageSize, totalRows: USERS.length }}
        onPaginationChange={(next) => setPageNumber(next.pageNumber)}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${selectedIds.length} user(s)?`}
        description="This action cannot be undone."
        onConfirm={() => {
          setSelectedIds([]);
          setConfirmOpen(false);
        }}
      />
    </AdminPage>
  );
}
