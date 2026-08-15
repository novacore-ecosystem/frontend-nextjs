export {
  AdminLayout,
  AdminSidebarToggle,
  AdminSidebarCollapseToggle,
  useAdminLayout,
  type AdminLayoutProps,
} from "../components/admin/admin-layout";
export { AdminSidebar, type AdminSidebarProps } from "../components/admin/admin-sidebar";
export type {
  NavigationItem,
  NavigationGroup,
  NavigationItemRenderer,
  NavigationItemRenderProps,
  ApplicationDefinition,
} from "../components/admin/nav-types";
export { AdminHeader, type AdminHeaderProps } from "../components/admin/admin-header";
export { ApplicationSwitcher, type ApplicationSwitcherProps } from "../components/admin/application-switcher";
export {
  CommandPalette,
  useCommandPalette,
  type CommandPaletteProps,
  type CommandPaletteAction,
} from "../components/admin/command-palette";
export {
  AdminPage,
  PageContainer,
  PageSection,
  PageHeader,
  Toolbar,
  ContentPanel,
  type PageHeaderProps,
} from "../components/admin/page";
export { AdminBreadcrumb, type AdminBreadcrumbItem, type AdminBreadcrumbProps } from "../components/admin/breadcrumb";
export {
  PermissionProvider,
  usePermissionContext,
  type PermissionProviderProps,
} from "../components/admin/permission-provider";
export { usePermission, type UsePermissionResult } from "../components/admin/use-permission";
export { PermissionGate, type PermissionGateProps } from "../components/admin/permission-gate";
export { PermissionBoundary, type PermissionBoundaryProps } from "../components/admin/permission-boundary";
export { PermissionButton, type PermissionButtonProps } from "../components/admin/permission-button";
export { AccessDenied, type AccessDeniedProps } from "../components/admin/access-denied";
