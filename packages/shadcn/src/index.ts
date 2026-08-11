// Theme
export * from "./theme";

// Primitive UI
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./components/ui/button";
export { Input, type InputProps } from "./components/ui/input";
export { Textarea, type TextareaProps } from "./components/ui/textarea";
export { Label, type LabelProps } from "./components/ui/label";
export { Badge, type BadgeProps, type BadgeVariant } from "./components/ui/badge";
export { Avatar, type AvatarProps } from "./components/ui/avatar";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/ui/card";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./components/ui/dialog";
export { Popover, type PopoverProps } from "./components/ui/popover";
export { Tooltip, TooltipProvider, type TooltipProps } from "./components/ui/tooltip";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
export { Separator, type SeparatorProps } from "./components/ui/separator";
export { Skeleton } from "./components/ui/skeleton";
export { Checkbox, type CheckboxProps } from "./components/ui/checkbox";
export { Switch, type SwitchProps } from "./components/ui/switch";
export { Select, type SelectProps, type SelectOption } from "./components/ui/select";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "./components/ui/dropdown-menu";

// Composed
export { SearchInput, type SearchInputProps } from "./components/composed/search-input";
export { PasswordInput, type PasswordInputProps } from "./components/composed/password-input";
export { FormField, FormSection, FormActions, type FormFieldProps } from "./components/composed/form-field";
export { ConfirmDialog, type ConfirmDialogProps } from "./components/composed/confirm-dialog";

// Admin
export { AdminLayout, AdminSidebarToggle, useAdminLayout, type AdminLayoutProps } from "./components/admin/admin-layout";
export { AdminSidebar, AdminSidebarSection, AdminSidebarItem } from "./components/admin/admin-sidebar";
export { AdminHeader } from "./components/admin/admin-header";
export {
  AdminPage,
  PageContainer,
  PageSection,
  PageHeader,
  Toolbar,
  ContentPanel,
  type PageHeaderProps,
} from "./components/admin/page";
export { EmptyState, LoadingState, ErrorState, SkeletonList } from "./components/admin/states";
export { StatusBadge, type StatusBadgeProps, type StatusTone } from "./components/admin/status-badge";
export { PermissionGate, type PermissionGateProps } from "./components/admin/permission-gate";
export {
  DataTable,
  fromPaginatedResult,
  type DataTableProps,
  type DataTableColumn,
  type DataTableSortState,
  type DataTableSortDirection,
  type DataTablePaginationState,
} from "./components/admin/data-table";

// Utility
export { cn } from "./lib/cn";
