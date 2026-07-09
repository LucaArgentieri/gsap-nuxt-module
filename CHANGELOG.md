# Changelog


## v1.2.4

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.2.3...v1.2.4)

### 🩹 Fixes

- **useGsap:** Drop onBeforeRouteLeave for onUnmounted-based transition cleanup ([5304e3c](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/5304e3c))

### 🏡 Chore

- Normalize repository field in package.json ([d9b134b](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/d9b134b))

### ❤️ Contributors

- Luca Argentieri <lucaargentieri98@gmail.com>

## v1.2.3

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.2.2...v1.2.3)

### ⚠️ Behavior change

- **useGsap:** `useGsap(setup)` now auto-scopes CSS class/id selectors to the calling component's root element by default. Previously, without an explicit `scope`, selectors matched globally. If you relied on global selectors, pass `scope: null` to opt out. This is a deliberate departure from `@gsap/react`'s `useGSAP()`, which never scopes selectors unless you pass `scope` explicitly — the Nuxt module can auto-detect the calling component's root via Vue's `getCurrentInstance()`, so it defaults to the safer, scoped behavior instead.

### 🚀 Enhancements

- **useGsap:** Auto-scope contexts to the component root, accept flexible scope targets ([d08f948](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/d08f948))

### 🩹 Fixes

- Address performance issues and antipatterns from project review ([12fa20d](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/12fa20d))
- **useGsap:** Defer revert via page:transition:finish, drop unmount-timing assumption ([0374ef3](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/0374ef3))

### 💅 Refactors

- **useGsap:** Replace setupVersion/isUnmounted with cancelPending closure ([df1c64f](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/df1c64f))
- **useGsap:** Run setup synchronously, drop nextTick deferral ([2d63a84](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/2d63a84))

### ❤️ Contributors

- Luca Argentieri <lucaargentieri98@gmail.com>
- Claude <noreply@anthropic.com>

## v1.2.2

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.2.1...v1.2.2)

### 🩹 Fixes

- **useGsap:** Only defer revert to page:transition:finish when a transition exists ([c712967](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/c712967))
- **playground:** Guard transition hooks and add no-transition demo ([60311bc](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/60311bc))

### ❤️ Contributors

- Luca Argentieri <lucaargentieri98@gmail.com>

## v1.2.1

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.9...v1.2.1)

### 🩹 Fixes

- **useGsap:** Replace onScopeDispose with onUnmounted to fix premature context revert ([2abbd09](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/2abbd09))
- **playground:** Fix ScrollTrigger cleanup and add null guards ([8462a8d](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/8462a8d))

### 🏡 Chore

- **release:** V1.1.9 ([ae1d08f](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/ae1d08f))
- Bump gsap to 3.15.0 and module to 1.2.0 ([fe5ccc3](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/fe5ccc3))
- Revert manual version bump, let changelogen handle release ([7ef4379](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/7ef4379))
- Use bun.lock, bump module to v1.2.0 ([70ee121](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/70ee121))
- **release:** V1.2.0 ([66ea64f](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/66ea64f))

### ❤️ Contributors

- Luca Argentieri <lucaargentieri98@gmail.com>
- Claude <noreply@anthropic.com>

## v1.2.0

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.9...v1.2.0)

### 🏡 Chore

- Bump gsap to 3.15.0 and module to 1.2.0 ([fe5ccc3](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/fe5ccc3))
- Revert manual version bump, let changelogen handle release ([7ef4379](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/7ef4379))
- Use bun.lock, bump module to v1.2.0 ([70ee121](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/70ee121))

### ❤️ Contributors

- Luca Argentieri <Lucaargentieri-98@hotmail.it>
- Claude <noreply@anthropic.com>

## v1.1.9

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.8...v1.1.9)

### 🚀 Enhancements

- **useGsap:** Add cleanupOn option for early GSAP cleanup before page transitions ([2d261b3](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/2d261b3))

### 🩹 Fixes

- **types:** Remove false-positive null from plugin composable return type ([1aba076](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/1aba076))
- **app.vue:** Wrap NuxtPage in v-slot to fix Transition warning ([1cb0056](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/1cb0056))
- Resolve TypeScript null warnings in GSAP composables ([d8d4f3d](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/d8d4f3d))
- **types:** Suppress TS1149 casing errors from GSAP package ([f930a7b](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/f930a7b))

### 💅 Refactors

- **runtime:** Inline Flip/Draggable/Observer loaders, remove gsap-loaders.js ([16660e1](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/16660e1))

### 📖 Documentation

- **useGsap:** Document cleanupOn edge case for navigation guard rejection ([500d473](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/500d473))

### 🏡 Chore

- **playground:** Convert pages to TypeScript and fix scroll behavior ([34d7922](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/34d7922))

### ❤️ Contributors

- Luca Argentieri <Lucaargentieri-98@hotmail.it>
- Claude <noreply@anthropic.com>

## v1.1.8

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.7...v1.1.8)

### 🚀 Enhancements

- Add useGsap context overload with auto-cleanup ([5a8cd71](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/5a8cd71))

### ❤️ Contributors

- Luca Argentieri <Lucaargentieri-98@hotmail.it>

## v1.1.7

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.5...v1.1.7)

### 🩹 Fixes

- **deps:** Update nuxtjs monorepo to v4 ([36f407e](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/36f407e))
- Resolve GSAP import casing across OSes ([5daa8cd](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/5daa8cd))

### 💅 Refactors

- Improve gsap runtime and cleanup patterns ([c631572](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/c631572))

### 🏡 Chore

- **release:** V1.1.5 ([13f809f](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/13f809f))
- **release:** V1.1.6 ([5e982db](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/5e982db))
- **release:** V1.1.5 ([6b477ba](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/6b477ba))
- Stabilize playground build and CI checks ([e29452c](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/e29452c))
- Exclude test fixtures from root typecheck ([a60df0c](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/a60df0c))
- **release:** V1.1.6 ([8b98c03](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/8b98c03))

### 🤖 CI

- Prepare playground before type checks ([3287a99](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/3287a99))

### ❤️ Contributors

- Luca Argentieri <Lucaargentieri-98@hotmail.it>
- LucaArgentieri <lucaargentieri-98@hotmail.it>

## v1.1.6

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.5...v1.1.6)

### 🩹 Fixes

- **deps:** Update nuxtjs monorepo to v4 ([36f407e](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/36f407e))
- Resolve GSAP import casing across OSes ([5daa8cd](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/5daa8cd))

### 💅 Refactors

- Improve gsap runtime and cleanup patterns ([c631572](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/c631572))

### 🏡 Chore

- **release:** V1.1.5 ([13f809f](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/13f809f))
- **release:** V1.1.6 ([5e982db](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/5e982db))
- **release:** V1.1.5 ([6b477ba](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/6b477ba))
- Stabilize playground build and CI checks ([e29452c](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/e29452c))
- Exclude test fixtures from root typecheck ([a60df0c](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/a60df0c))

### 🤖 CI

- Prepare playground before type checks ([3287a99](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/3287a99))

### ❤️ Contributors

- Luca Argentieri <Lucaargentieri-98@hotmail.it>
- LucaArgentieri <lucaargentieri-98@hotmail.it>

## v1.1.5

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.6...v1.1.5)

## v1.1.6

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.5...v1.1.6)

## v1.1.5

[compare changes](https://github.com/LucaArgentieri/gsap-nuxt-module/compare/v1.1.4...v1.1.5)

### 🏡 Chore

- Remove link to changelog from README ([9b51778](https://github.com/LucaArgentieri/gsap-nuxt-module/commit/9b51778))

### ❤️ Contributors

- LucaArgentieri <lucaargentieri-98@hotmail.it>

