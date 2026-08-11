# Memory

> Chronological action log. Hooks and AI append to this file automatically.
> Old sessions are consolidated by the daemon weekly.

## Session: 2026-08-11 15:49

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 16:40 | Scaffolded pnpm workspace + full @novacore/frontend-next-shadcn package (theme system, 17 primitives, 4 composed, 11 admin components) | pnpm-workspace.yaml, packages/shadcn/** | success | ~large |
| 16:55 | Discovered tsup bundling stripped all "use client" directives; fixed via bundle:false + postbuild safety script | packages/shadcn/tsup.config.ts, packages/shadcn/scripts/postbuild-use-client.mjs | fixed (bug-001) | ~medium |
| 17:05 | Scaffolded apps/playground Next.js App Router demo (5 routes) consuming the package via workspace | apps/playground/** | success | ~large |
| 17:15 | Built package (tsup+tailwind), typechecked clean, playground next build succeeded, dev server verified via curl + headless Chrome screenshots (components/users/theme pages all render correctly) | packages/shadcn/dist, apps/playground | success | ~medium |
| 17:20 | Wrote README, updated STATUS.md/cerebrum.md/buglog.json, regenerated anatomy.md via `openwolf scan` | README.md, .wolf/* | success | ~medium |

## Session: 2026-08-12

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| - | Scaffolded full @novacore/frontend-next-mui client-facing package: theme (8 presets, ClientProvider w/ AppRouterCacheProvider), layout/typography/actions/navigation/hero/card/product/forms/feedback/data/image/motion components | packages/mui/** | success | ~large |
| - | Fixed TS overload errors from raw MUI polymorphic props (Button target, Box component, Stack alignItems) via untyped prop-object spread pattern | packages/mui/src/components/{actions,layout}/* | fixed | ~medium |
| - | next build crashed prerendering /mui: inline onChange closures built unconditionally in TextField/Select/Checkbox/Rating/etc, passed to MUI client components from a Server Component page (ProductCard w/ readOnly Rating) | packages/mui/src/components/{data,forms}/* | fixed (bug-002) | ~medium |
| - | dev console warned alignItems/justifyContent/flexWrap leaking onto DOM — MUI 9.3.1 Stack doesn't forward them as system props like older versions | packages/mui/src/components/layout/stack.tsx | fixed (bug-003) | ~small |
| - | Built polished /mui storefront playground (Header/Hero/Stats/ProductGrid/Features/Testimonials/CTA/Footer) + /mui/components + /mui/theme; added @novacore/frontend-next-mui to playground deps | apps/playground/src/app/mui/**, apps/playground/next.config.mjs | success | ~large |
| - | Verified: both packages build+typecheck clean, playground next build succeeds (9 routes static), dev server clean, screenshots confirm storefront/showcase/theme customizer render correctly | packages/mui/dist, apps/playground | success | ~medium |
| - | Updated README, STATUS.md, cerebrum.md, buglog.json, regenerated anatomy.md | README.md, .wolf/* | success | ~medium |
