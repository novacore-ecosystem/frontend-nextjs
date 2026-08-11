"use client";

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  ConfirmDialog,
  Container,
  FadeIn,
  FeatureCard,
  FormField,
  Heading,
  PasswordField,
  Price,
  ProductQuantitySelector,
  ProductVariantSelector,
  Rating,
  SearchField,
  Select,
  Stack,
  Switch,
  Text,
  TextField,
  Tooltip,
  useToast,
} from "@novacore/frontend-next-mui";
import * as React from "react";

export default function MuiComponentsPage() {
  const { showToast } = useToast();
  const [search, setSearch] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [variant, setVariant] = React.useState("m");
  const [quantity, setQuantity] = React.useState(1);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, display: "flex", flexDirection: "column", gap: 5 }}>
        <Heading size="h2">Component showcase</Heading>

        <FadeIn>
          <Stack direction="row" wrap spacing={1.5}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button loading>Loading</Button>
          </Stack>
        </FadeIn>

        <Stack direction="row" wrap spacing={1}>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="secondary">Secondary</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="error">Error</Badge>
          <Badge variant="outline">Outline</Badge>
        </Stack>

        <Alert tone="info" title="Heads up">
          This showcase demonstrates the NovaCore MUI implementation — no MUI imports appear in this file.
        </Alert>

        <FeatureCard title="Feature card" description="A simple content card with an icon slot." />

        <Card>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar fallback="JD" />
            <Box>
              <Text weight="semibold">Jane Doe</Text>
              <Rating value={4.5} count={128} size="sm" />
            </Box>
            <Price amount={129} currency="USD" compareAtAmount={159} sx={{ ml: "auto" }} />
          </CardContent>
        </Card>

        <Stack spacing={2.5} sx={{ maxWidth: 420 }}>
          <FormField label="Email" required>
            <TextField type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Password">
            <PasswordField placeholder="••••••••" />
          </FormField>
          <FormField label="Role">
            <Select
              placeholder="Select a role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "editor", label: "Editor" },
                { value: "viewer", label: "Viewer" },
              ]}
            />
          </FormField>
          <SearchField value={search} onChange={setSearch} placeholder="Search products…" />
          <Stack direction="row" align="center" spacing={1}>
            <Checkbox label="Subscribe to newsletter" />
          </Stack>
          <Stack direction="row" align="center" spacing={1}>
            <Switch label="Enable notifications" />
          </Stack>
        </Stack>

        <Stack spacing={1.5} sx={{ maxWidth: 420 }}>
          <Text weight="semibold">Product configurator</Text>
          <ProductVariantSelector
            label="Size"
            value={variant}
            onChange={setVariant}
            options={[
              { value: "s", label: "S" },
              { value: "m", label: "M" },
              { value: "l", label: "L" },
              { value: "xl", label: "XL", disabled: true },
            ]}
          />
          <ProductQuantitySelector value={quantity} onChange={setQuantity} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Tooltip content="This is a tooltip">
            <Button variant="outline">Hover me</Button>
          </Tooltip>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete item
          </Button>
          <Button variant="outline" onClick={() => showToast({ message: "Saved successfully", tone: "success" })}>
            Show toast
          </Button>
        </Stack>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete this item?"
          description="This action cannot be undone."
          onConfirm={() => setConfirmOpen(false)}
        />
      </Box>
    </Container>
  );
}
