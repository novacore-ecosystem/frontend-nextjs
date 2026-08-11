import * as React from "react";
import { cn } from "../../lib/cn";
import { Label } from "../ui/label";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, required, description, error, className, children }: FormFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      {label ? (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      {children}
      {description && !error ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function FormSection({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("grid gap-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title ? <h3 className="text-sm font-medium">{title}</h3> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export function FormActions({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex items-center justify-end gap-2 pt-2", className)}>{children}</div>;
}
