"use client";

import { useTranslation } from "../../i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PermissionAuditHistory } from "./permission-audit-history";
import type { AccessControlSubjectType } from "./types";

export interface PermissionAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectType: AccessControlSubjectType;
  subjectId: string;
  /** Shown in the dialog title, e.g. the role/user's display name — falls back to a generic title when omitted. */
  subjectLabel?: string;
}

/** `<PermissionAuditHistory>` behind a controlled `Dialog` — the "View change history" action on `RoleEditorPage` and `UserPermissionAssignment`'s per-row action both open this. */
export function PermissionAuditDialog({ open, onOpenChange, subjectType, subjectId, subjectLabel }: PermissionAuditDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{subjectLabel ? t("auditLog.titleFor", { name: subjectLabel }) : t("auditLog.title")}</DialogTitle>
        </DialogHeader>
        <PermissionAuditHistory subjectType={subjectType} subjectId={subjectId} />
      </DialogContent>
    </Dialog>
  );
}
