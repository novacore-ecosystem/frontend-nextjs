"use client";

import {
  AdminBreadcrumb,
  AdminPage,
  Button,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  PageHeader,
  StatusBadge,
} from "@novacore/frontend-next-shadcn";
import * as React from "react";

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
  const pageSize = 10;

  const pageRows = USERS.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize);

  return (
    <AdminPage>
      <PageHeader
        title="Users"
        description="Demonstrates DataTable: sorting, selection, pagination."
        breadcrumb={<AdminBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Users" }]} />}
      />
      <DataTable
        data={pageRows}
        columns={columns}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
        bulkActions={
          <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
            Delete selected
          </Button>
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
