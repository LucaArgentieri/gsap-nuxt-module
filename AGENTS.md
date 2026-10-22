# Agent guide

## Purpose

`gsap-nuxt-module` integrates GSAP with Nuxt 3 and 4. Keep the runtime small,
SSR-safe, deterministic, and friendly to page transitions.

## Commands

- Install: `bun install --frozen-lockfile`
- Prepare generated Nuxt types: `bun run dev:prepare`
- Lint: `bun run lint`
- Unit and integration tests: `bun run test`
- Coverage thresholds: `bun run test:coverage`
- Bundle and size budgets: `bun run prepack && bun run test:bundle`
- Consumer compatibility: `NUXT_VERSION=3.21.11 bun run test:compat` (or `4.6.2`)
- Typecheck: `bun run test:types`
- Production playground build: `bun run dev:build`
- Package build: `bun run prepack`

Run `bun run dev:prepare` before typechecking after changing module templates or
auto-imports.

## Architecture and invariants

- `src/plugin-catalog.ts` is the canonical plugin registry. Never duplicate a
  plugin name, import path, dependency, or composable mapping elsewhere.
- Plugin selection happens at Nuxt build time. A plugin absent from
  `gsap.plugins` must not appear in client build output.
- Dependencies must be registered before dependants.
- `useGsap(setup)` must create animation state only after mount and revert every
  context exactly once.
- Page-leave animations must remain alive until the Nuxt leave transition
  finishes. Without a transition, cleanup must happen immediately on unmount.
- Runtime configuration must not be written into public payloads.
- Public composables require types, documentation, and tests in the same change.

## Change checklist

1. Update the canonical catalog or runtime behavior.
2. Add focused unit coverage and, for navigation behavior, transition coverage.
3. Update README, Docus content, and `docs/public/llms*.txt` when public behavior changes.
4. Run lint, tests, typecheck, the zero-plugin build, and the playground build.
5. Inspect generated output for accidental optional-plugin imports.

The full local release gate is `bun run check`. Browser tests require the
Playwright Chromium binary.

Do not run formatters that rewrite unrelated files or commit generated `.nuxt`,
`.output`, or `dist` artifacts.
