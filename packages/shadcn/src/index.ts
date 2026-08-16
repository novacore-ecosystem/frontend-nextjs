// Theme
export * from "./theme";

// i18n
export {
  I18nProvider,
  useI18nContext,
  useTranslation,
  BUILTIN_TRANSLATIONS,
  type I18nProviderProps,
  type I18nContextValue,
  type BuiltinTranslationKey,
} from "./i18n";

// Hooks
export { usePersistentState } from "./hooks/use-persistent-state";
export { useDebouncedValue } from "./hooks/use-debounced-value";
export { useDebouncedCallback, type DebouncedCallback } from "./hooks/use-debounced-callback";

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
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetProps,
  type SheetContentProps,
  type SheetSide,
} from "./components/ui/sheet";
export { ScrollArea, type ScrollAreaProps } from "./components/ui/scroll-area";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./components/ui/collapsible";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  type CommandDialogProps,
} from "./components/ui/command";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  type BreadcrumbLinkProps,
} from "./components/ui/breadcrumb";

// Composed
export { SearchInput, type SearchInputProps } from "./components/composed/search-input";
export { PasswordInput, type PasswordInputProps } from "./components/composed/password-input";
export { FormField, FormSection, FormActions, type FormFieldProps } from "./components/composed/form-field";
export { ConfirmDialog, type ConfirmDialogProps } from "./components/composed/confirm-dialog";
export { FilterToolbar, type FilterToolbarProps } from "./components/composed/filter-toolbar";
export { Pagination, type PaginationProps, type PaginationState } from "./components/composed/pagination";
export {
  AdvancedFilter,
  type AdvancedFilterProps,
  type FilterFieldConfig,
  type FilterFieldType,
} from "./components/composed/advanced-filter";
export { AdvancedSort, type AdvancedSortProps, type SortFieldConfig } from "./components/composed/advanced-sort";
export {
  ColumnVisibility,
  type ColumnVisibilityProps,
  type ColumnVisibilityColumn,
} from "./components/composed/column-visibility";
export { AboutDialog, type AboutDialogProps, type AboutDialogLink } from "./components/composed/about-dialog";
export { LocaleSwitcher, type LocaleSwitcherProps, type LocaleOption } from "./components/composed/locale-switcher";

// Admin
export {
  AdminLayout,
  AdminSidebarToggle,
  AdminSidebarCollapseToggle,
  useAdminLayout,
  type AdminLayoutProps,
} from "./components/admin/admin-layout";
export { AdminSidebar, type AdminSidebarProps } from "./components/admin/admin-sidebar";
export type {
  NavigationItem,
  NavigationGroup,
  NavigationItemRenderer,
  NavigationItemRenderProps,
  ApplicationDefinition,
} from "./components/admin/nav-types";
export { AdminHeader, type AdminHeaderProps } from "./components/admin/admin-header";
export { ApplicationSwitcher, type ApplicationSwitcherProps } from "./components/admin/application-switcher";
export {
  CommandPalette,
  useCommandPalette,
  type CommandPaletteProps,
  type CommandPaletteAction,
} from "./components/admin/command-palette";
export {
  AdminPage,
  PageContainer,
  PageSection,
  PageHeader,
  Toolbar,
  ContentPanel,
  type PageHeaderProps,
} from "./components/admin/page";
export { AdminBreadcrumb, type AdminBreadcrumbItem, type AdminBreadcrumbProps } from "./components/admin/breadcrumb";
export { HowTo, type HowToProps } from "./components/admin/how-to";
export {
  UserProfile,
  type UserProfileProps,
  type UserProfileUser,
  type UserProfileMenuItem,
} from "./components/admin/user-profile";
export { EmptyState, LoadingState, ErrorState, SkeletonList } from "./components/admin/states";
export { StatusBadge, type StatusBadgeProps, type StatusTone } from "./components/admin/status-badge";
export {
  StatCard,
  StatCardRow,
  type StatCardProps,
  type StatCardRowProps,
  type StatCardTone,
  type StatCardTrend,
} from "./components/admin/stat-card";
export {
  DataFreshness,
  useDataFreshness,
  type DataFreshnessProps,
  type DataFreshnessState,
} from "./components/admin/data-freshness";
export { RelativeTime, type RelativeTimeProps, type RelativeTimeMode } from "./components/admin/relative-time";
export {
  PermissionProvider,
  usePermissionContext,
  type PermissionProviderProps,
} from "./components/admin/permission-provider";
export { usePermission, type UsePermissionResult } from "./components/admin/use-permission";
export { PermissionGate, type PermissionGateProps } from "./components/admin/permission-gate";
export { PermissionBoundary, type PermissionBoundaryProps } from "./components/admin/permission-boundary";
export { PermissionButton, type PermissionButtonProps } from "./components/admin/permission-button";
export { AccessDenied, type AccessDeniedProps } from "./components/admin/access-denied";
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
