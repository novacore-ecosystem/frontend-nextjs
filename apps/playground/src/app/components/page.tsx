"use client";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Label,
  PasswordInput,
  SearchInput,
  Select,
  Separator,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipProvider,
} from "@novacore/frontend-next-shadcn";
import * as React from "react";

export default function ComponentsPage() {
  const [search, setSearch] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <TooltipProvider>
      <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
        <h1 className="text-2xl font-semibold">Component showcase</h1>

        <section className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button loading>Loading</Button>
        </section>

        <section className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description text.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Avatar fallback="JD" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>

        <section className="grid max-w-sm gap-4">
          <FormField label="Email" htmlFor="email" required>
            <Input id="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Password" htmlFor="password">
            <PasswordInput id="password" placeholder="••••••••" />
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
          <SearchInput value={search} onValueChange={setSearch} placeholder="Search components…" />
          <div className="flex items-center gap-2">
            <Checkbox id="agree" />
            <Label htmlFor="agree">I agree</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="notify" />
            <Label htmlFor="notify">Notifications</Label>
          </div>
        </section>

        <Separator />

        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab one</TabsTrigger>
            <TabsTrigger value="tab2">Tab two</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content for tab one.</TabsContent>
          <TabsContent value="tab2">Content for tab two.</TabsContent>
        </Tabs>

        <section className="flex flex-wrap gap-3">
          <Tooltip content="This is a tooltip">
            <Button variant="outline">Hover me</Button>
          </Tooltip>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>Dialog description text.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete item
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete this item?"
            description="This action cannot be undone."
            onConfirm={() => setConfirmOpen(false)}
          />
        </section>
      </main>
    </TooltipProvider>
  );
}
