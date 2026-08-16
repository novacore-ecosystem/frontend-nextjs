"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export interface AboutDialogLink {
  label: string;
  href: string;
}

export interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName: string;
  description?: string;
  version?: string;
  buildInfo?: string;
  links?: AboutDialogLink[];
  closeLabel?: string;
}

/** Generic "About / Help" dialog — every string is caller-supplied, nothing app-specific is hardcoded here. Trigger (e.g. a header `?` button) is owned by the consumer. */
export function AboutDialog({
  open,
  onOpenChange,
  appName,
  description,
  version,
  buildInfo,
  links,
  closeLabel = "Close",
}: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{appName}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        {version || buildInfo ? (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {version ? (
              <div>
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-mono">{version}</dd>
              </div>
            ) : null}
            {buildInfo ? (
              <div>
                <dt className="text-muted-foreground">Build</dt>
                <dd className="font-mono">{buildInfo}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {links && links.length > 0 ? (
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-primary hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {closeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
