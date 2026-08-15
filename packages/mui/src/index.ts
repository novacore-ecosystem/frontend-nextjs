// Theme
export * from "./theme";

// Layout
export { Container, type ContainerProps, type ContainerMaxWidth } from "./components/layout/container";
export { Box, type BoxProps } from "./components/layout/box";
export { Section, type SectionProps, type SectionPadding, type SectionBackground } from "./components/layout/section";
export { Stack, type StackProps } from "./components/layout/stack";
export { Flex, type FlexProps } from "./components/layout/flex";
export { Grid, GridItem, type GridProps, type GridItemProps } from "./components/layout/grid";
export { Divider, type DividerProps } from "./components/layout/divider";
export { Spacer, type SpacerProps } from "./components/layout/spacer";
export { AspectRatio, type AspectRatioProps } from "./components/layout/aspect-ratio";

// Typography
export { Heading, type HeadingProps, type HeadingSize } from "./components/typography/heading";
export { Text, type TextProps, type TextSize, type TextColor } from "./components/typography/text";
export { Label, Caption, Link, Code, type LabelProps, type CaptionProps, type LinkProps, type CodeProps } from "./components/typography/misc";

// Actions
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./components/actions/button";
export { IconButton, type IconButtonProps } from "./components/actions/icon-button";
export { LinkButton, type LinkButtonProps } from "./components/actions/link-button";

// Navigation
export { Header, type HeaderProps } from "./components/navigation/header";
export { NavigationMenu, type NavigationMenuProps, type NavigationItem } from "./components/navigation/navigation-menu";
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "./components/navigation/breadcrumb";
export { Footer, FooterColumn, type FooterProps } from "./components/navigation/footer";

// Hero / landing
export { HeroSection, type HeroSectionProps } from "./components/hero/hero-section";
export { FeatureGrid, type FeatureGridProps, type FeatureItem } from "./components/hero/feature-section";
export { CTASection, type CTASectionProps } from "./components/hero/cta-section";
export { StatsSection, type StatsSectionProps, type StatItem } from "./components/hero/stats-section";
export { TestimonialSection, type TestimonialSectionProps, type Testimonial } from "./components/hero/testimonial-section";

// Card
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from "./components/card/card";
export { MediaCard, type MediaCardProps } from "./components/card/media-card";
export { FeatureCard, ActionCard, type FeatureCardProps, type ActionCardProps } from "./components/card/feature-card";

// Product / e-commerce
export { ProductCard, type ProductCardProps, type ProductCardViewModel } from "./components/product/product-card";
export { ProductGrid, type ProductGridProps } from "./components/product/product-grid";
export { ProductGallery, type ProductGalleryProps } from "./components/product/product-gallery";
export { Price, type PriceProps } from "./components/product/price";
export { ProductBadge, type ProductBadgeProps, type ProductBadgeKind } from "./components/product/product-badge";
export { ProductVariantSelector, type ProductVariantSelectorProps, type ProductVariantOption } from "./components/product/product-variant-selector";
export { ProductQuantitySelector, type ProductQuantitySelectorProps } from "./components/product/product-quantity-selector";

// Forms
export { Form, FormActions, type FormProps } from "./components/forms/form";
export { FormField, type FormFieldProps } from "./components/forms/form-field";
export { TextField, type TextFieldProps } from "./components/forms/text-field";
export { Textarea, type TextareaProps } from "./components/forms/textarea";
export { Select, type SelectProps, type SelectOption } from "./components/forms/select";
export { Autocomplete, type AutocompleteProps, type AutocompleteOption } from "./components/forms/autocomplete";
export { Checkbox, Switch, RadioGroup, type CheckboxProps, type SwitchProps, type RadioGroupProps, type RadioOption } from "./components/forms/checkbox-radio-switch";
export { PasswordField, type PasswordFieldProps } from "./components/forms/password-field";
export { SearchField, type SearchFieldProps } from "./components/forms/search-field";
export { DateField, DateRangeField, type DateFieldProps, type DateRangeFieldProps } from "./components/forms/date-field";
export { FileUpload, type FileUploadProps } from "./components/forms/file-upload";

// Feedback
export { Alert, type AlertProps, type AlertTone } from "./components/feedback/alert";
export { Dialog, DialogContent, DialogFooter, type DialogProps } from "./components/feedback/dialog";
export { Drawer, type DrawerProps } from "./components/feedback/drawer";
export { ConfirmDialog, type ConfirmDialogProps } from "./components/feedback/confirm-dialog";
export { Tooltip, type TooltipProps } from "./components/feedback/tooltip";
export { Progress, Skeleton, Loading, type ProgressProps, type SkeletonProps } from "./components/feedback/progress";
export { ToastProvider, useToast, type ToastOptions, type ToastTone } from "./components/feedback/toast";

// Data display
export { Avatar, type AvatarProps } from "./components/data/avatar";
export { Badge, Chip, type BadgeProps, type ChipProps, type BadgeTone } from "./components/data/badge";
export { Rating, type RatingProps } from "./components/data/rating";
export { Stat, type StatProps } from "./components/data/stat";

// Image
export { ResponsiveImage, type ResponsiveImageProps } from "./components/image/responsive-image";

// Motion
export { FadeIn, SlideIn, ScaleIn, type MotionProps } from "./components/motion/motion";

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
  AdminNavigationItem,
  AdminNavigationGroup,
  AdminNavigationItemRenderer,
  AdminNavigationItemRenderProps,
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
