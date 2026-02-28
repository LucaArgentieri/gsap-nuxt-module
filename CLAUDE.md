# CLAUDE.md
Operating guide for Claude Code in `gsap-nuxt-module`.

## 1) Repository snapshot
- Nuxt module repo (TypeScript + ESM).
- Main implementation: `src/`.
- Demo playground: `playground/`.
- Tests: `test/` with Vitest + `@nuxt/test-utils/e2e`.

## 2) Rules and sources inspected
- `package.json`
- `.github/workflows/ci.yml`
- `eslint.config.mjs`
- `.editorconfig`
- representative files in `src/`, `test/`, `playground/`

## 3) Claude Code configuration in `.claude/`
- MCP config: `.claude/mcp.json` — enables remote Nuxt MCP at `https://nuxt.com/mcp`.
- Skills: `.claude/skills/gsap/` and `.claude/skills/nuxt/`.

## 3.1) Skills authoring pattern (mandatory for agents)

When creating or updating team skills, follow `.claude/skills/` conventions inspired by `antfu/skills` and `sanity-io/agent-toolkit`.

Required structure for each skill:

- `skills/<skill-name>/SKILL.md`
- `skills/<skill-name>/references/_sections.md`
- `skills/<skill-name>/references/_coverage-map.md`
- `skills/<skill-name>/references/*.md` (modular, topic-based)

Rule file naming prefixes:

- `core-` fundamentals and primitives
- `plugin-` plugin-specific architecture/rules
- `tools-` utilities, helper workflows, framework tooling
- `perf-` performance rules
- `a11y-` accessibility rules
- `debug-` debugging and iteration rules

Mandatory content for each rule file:

1. Why it matters
2. Incorrect pattern
3. Correct pattern
4. Official docs links

Agent checklist when adding a new skill:

1. Create folder + `SKILL.md` + `references/` skeleton.
2. Add `references/_sections.md` with reading order.
3. Add modular `references/*.md` with prefixed names.
4. Add/update `references/_coverage-map.md` from source docs index (for GSAP use `https://gsap.com/llms.txt`).
5. Keep naming stable (avoid unnecessary renames).

## 4) Package manager expectations
- CI runs with Bun.
- npm scripts are canonical for local usage docs.
- Bun equivalents are valid and usually mirror npm scripts.
- Project uses ESM (`"type": "module"`).

## 5) Install and prepare
From repo root, use one flow:

```bash
npm install
npm run dev:prepare
```

```bash
bun install
bunx nuxi prepare
```

`dev:prepare` performs module builder prepare/build and playground prepare.

## 6) Build and development commands
- Start playground: `npm run dev`
- Build playground: `npm run dev:build`
- Build package artifacts: `npm run prepack`

## 7) Lint, formatting, and type checks
- Lint: `npm run lint`
- Type checks: `npm run test:types`
- Bun equivalents generally work by replacing `npm run` with `bun run`.

Formatting baseline:
- `.editorconfig`: 2 spaces, LF, UTF-8, trim trailing whitespace, final newline.
- ESLint uses `@nuxt/eslint-config/flat` with stylistic rules enabled.
- No dedicated Prettier config is present.

## 8) Test commands (with single-test examples)
- Full suite once: `npm run test`
- Watch mode: `npm run test:watch`

Single file:

```bash
npm run test -- test/basic.test.ts
```

Single test name:

```bash
npm run test -- -t "renders the index page"
```

Single file + single test name:

```bash
npm run test -- test/basic.test.ts -t "renders the index page"
```

## 9) CI baseline to reproduce locally
Current CI sequence: `bun install`, `bunx nuxi prepare`, `bun run test`.
For meaningful changes, run at least that same sequence before handoff.

## 10) Code style guidelines for agents

### Imports
- Use ESM imports/exports only.
- Prefer explicit imports (no wildcard imports).
- Use `import type` for type-only symbols.
- Keep import groups readable in this order:
  1) Node built-ins (`node:*`)
  2) external packages
  3) internal relative imports
  4) Nuxt aliases (`#app`) when used
- Remove unused imports.

### Formatting and structure
- Respect `.editorconfig` exactly.
- Prefer single quotes in TS/JS unless a file already uses a different style.
- Keep objects/functions readable; avoid compressed one-liners.

### Types and API boundaries
- Prefer explicit types for module options and exported APIs.
- Use interfaces for options/config objects.
- Derive key unions with `keyof typeof` when reflecting runtime maps.
- Prefer narrow types + generics; avoid `any`.
- Keep type assertions local and justified.

### Naming conventions
- Composables: `useXxx` (`useDraggable`, `useScrollTrigger`).
- Factories/helpers: camelCase verb-based names (`createGsapComposable`).
- Types/interfaces: PascalCase (`ModuleOptions`, `GSAPPluginName`).
- Runtime objects/maps: camelCase (`gsapPlugins`, `pluginDependencies`).

### Error handling and logging
- Throw actionable errors for invalid configuration or impossible states.
- Prefix runtime-facing logs/errors with `[gsap-nuxt-module]`.
- Include remediation hints when possible.
- Use `try/catch` around dynamic imports/registration where failures can occur.
- Never swallow errors silently.

### Nuxt module conventions
- Keep wiring logic centered in `src/module.ts`.
- Use `defineNuxtModule` with clear `meta`, `defaults`, and `setup`.
- Resolve runtime paths via `createResolver(import.meta.url)`.
- Register runtime plugin via `addPlugin`.
- Register auto-import dirs via `addImportsDir`.
- Keep public runtime options under `runtimeConfig.public.gsap`.

### Tests and fixtures
- Keep fixtures minimal under `test/fixtures/`.
- Use behavior-focused test names.
- Assert visible behavior (SSR output/plugin behavior), not internals.

## 11) Quick hygiene + pre-PR checks
- Avoid committing generated outputs (`.nuxt/`, `.output/`, transient artifacts) unless explicitly requested.
- Keep `playground/` edits intentional and not test hacks.
- If scripts/CI/style conventions change, update this file.

Run before handoff:

```bash
npm run lint
npm run test
npm run test:types
```

If packaging/module output changed:

```bash
npm run prepack
```

Instruction precedence:
1. Direct user request.
2. Repo config + CI behavior.
3. This `CLAUDE.md`.
