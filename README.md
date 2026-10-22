<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: gsap-nuxt-module
- Package name: gsap-nuxt-module
- Description: GSAP integration for Nuxt.
-->

![gsap-nuxt-module](https://github.com/LucaArgentieri/gsap-nuxt-module/blob/main/docs/public/social-card.jpg)

# gsap-nuxt-module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm size][npm-size-src]][npm-size-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

**Enhance your Nuxt application with powerful animations and transitions using GSAP!**

- [📖 Documentation](https://lucaargentieri.github.io/gsap-nuxt-module/)
- [🏀 Online playground](https://stackblitz.com/edit/gsap-nuxt-module?file=README.md)
- [📖 GSAP](https://gsap.com/)

## Features

- **Auto-import GSAP**: Easily integrate GSAP without manually importing it in every file.
- **Dynamic Plugin Registration**: Import and register GSAP plugins only if enabled in `nuxt.config.ts`, optimizing performance.
- **Composable for Each Plugin**: Use GSAP plugins as composables for a simple and direct experience.

## Quick Setup

1. Install the module to your Nuxt application with one command:

<!-- ```bash
npx nuxi module add gsap-nuxt-module
``` -->

```bash
 npm i gsap-nuxt-module
```

2. Add gsap-nuxt-module to the modules section of nuxt.config.ts

```bash
export default defineNuxtConfig({
  modules: ['gsap-nuxt-module'],
})
```

3. Here's how to use GSAP in your component:

```js
<script setup>
const elementRef = ref(null)

onMounted(() => {
  gsap.to(elementRef.value, {
    x: 100
  })
})
</script>

<template>
  <div ref="elementRef">GSAP me!</div>
</template>
```

## Example Configuration

1. In your nuxt.config.ts, enable the desired GSAP plugins:

```js
export default defineNuxtConfig({
  modules: ["gsap-nuxt-module"],
  gsap: {
    plugins: ["Draggable"],
  },
});
```

2. Here's how to use the Draggable plugin in your component:

```js
<script setup>
const Draggable = useDraggable()

const elementRef = ref(null)

onMounted(() => {
  Draggable.create(elementRef.value)
})
</script>

<template>
  <div ref="elementRef">Drag me!</div>
</template>
```

##### You can find more examples in [playground](https://github.com/LucaArgentieri/gsap-nuxt-module/tree/main/playground/pages)

That's it! You can now use gsap-nuxt-module in your Nuxt app ✨

## useGsap()

`useGsap()` returns the GSAP instance directly — use it to access `gsap.timeline()`,
`gsap.to()`, `gsap.set()`, utility methods like `gsap.utils.toArray()`, and more.
No import needed; it is auto-imported like all other composables.

```ts
<script setup lang="ts">
const gsap = useGsap()
const boxRef = ref(null)

onMounted(() => {
  const tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(boxRef.value, { x: 200, duration: 1, ease: 'power2.inOut' })
    .to(boxRef.value, { rotation: 360, duration: 0.8 })
})
</script>
```

### Context form (recommended)

Pass a `setup` function to wrap animations in a [`gsap.context()`](https://gsap.com/docs/v3/GSAP/gsap.context/).
The context reverts automatically when the component unmounts — no `onUnmounted` boilerplate needed.
During page navigation, cleanup is deferred until after the leave transition finishes.

```ts
<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)

useGsap(() => {
  gsap.from('.box', { opacity: 0, y: 30, duration: 0.6 })
}, { scope: containerRef })
</script>

<template>
  <div ref="containerRef">
    <div class="box">I animate in safely</div>
  </div>
</template>
```

Returns `{ contextSafe }` for wrapping event handlers that add animations after mount.
See the [full docs](https://lucaargentieri.github.io/gsap-nuxt-module/composables/use-gsap) for all options.

## Available composables

| Composable | Plugin | `nuxt.config.ts` key |
|---|---|---|
| `useGsap()` | GSAP core | — (always available) |
| `useScrollTrigger()` | ScrollTrigger | `ScrollTrigger` |
| `useScrollToPlugin()` | ScrollToPlugin | `ScrollToPlugin` |
| `useScrollSmoother()` | ScrollSmoother | `ScrollSmoother` |
| `useSplitText()` | SplitText | `SplitText` |
| `useScrambleTextPlugin()` | ScrambleTextPlugin | `ScrambleTextPlugin` |
| `useTextPlugin()` | TextPlugin | `TextPlugin` |
| `useDrawSVGPlugin()` | DrawSVGPlugin | `DrawSVGPlugin` |
| `useMorphSVGPlugin()` | MorphSVGPlugin | `MorphSVGPlugin` |
| `useMotionPathPlugin()` | MotionPathPlugin | `MotionPathPlugin` |
| `useMotionPathHelper()` | MotionPathHelper | `MotionPathHelper` |
| `useDraggable()` | Draggable | `Draggable` |
| `useFlip()` | Flip | `Flip` |
| `useInertiaPlugin()` | InertiaPlugin | `InertiaPlugin` |
| `useObserver()` | Observer | `Observer` |
| `usePixiPlugin()` | PixiPlugin | `PixiPlugin` |
| `useEaselPlugin()` | EaselPlugin | `EaselPlugin` |
| `usePhysics2DPlugin()` | Physics2DPlugin | `Physics2DPlugin` |
| `usePhysicsPropsPlugin()` | PhysicsPropsPlugin | `PhysicsPropsPlugin` |
| `useGSDevTools()` | GSDevTools | `GSDevTools` |
| `useCustomEase()` | CustomEase | `CustomEase` |
| `useRoughEase()` | RoughEase | `RoughEase` |
| `useExpoScaleEase()` | ExpoScaleEase | `ExpoScaleEase` |
| `useSlowMo()` | SlowMo | `SlowMo` |
| `useCustomWiggle()` | CustomWiggle | `CustomWiggle` |
| `useCustomBounce()` | CustomBounce | `CustomBounce` |

## Plugin loading

Only plugins listed in `nuxt.config.ts` are imported into the generated client
plugin. Unused plugins are absent from the build output, and required plugin
dependencies are added automatically.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  gsap: {
    plugins: ['ScrollTrigger', 'Draggable'],
    // only these two will be bundled
  },
})
```

## Cleanup

When using `useGsap()` with a setup function, cleanup is automatic. When using the zero-arg form, use `onUnmounted` to prevent memory leaks.

Plugin registration is handled once by the module at app startup — never call `gsap.registerPlugin()` manually.
In components, clean up only the instances your component created (tweens, timelines, ScrollTrigger instances, Draggable instances, etc.).

**Simple plugin instance cleanup (`Draggable`):**

```ts
<script setup lang="ts">
const Draggable = useDraggable()
const boxRef = ref<HTMLElement | null>(null)
let draggables: ReturnType<typeof Draggable.create> = []

onMounted(() => {
  if (!boxRef.value) return
  draggables = Draggable.create(boxRef.value)
})

onUnmounted(() => {
  draggables.forEach((instance) => instance.kill())
  draggables = []
})
</script>
```

See real cleanup examples in `playground/pages/draggable.vue`, `playground/pages/scroll-trigger.vue`, `playground/pages/split-text.vue`, and `playground/pages/scroll-smoother.vue`.

**Recommended — `gsap.context()` (covers all child tweens, timelines and ScrollTriggers):**

```ts
<script setup lang="ts">
const gsap = useGsap()
let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.to('.box', { x: 100 })
  })
})

onUnmounted(() => ctx.revert())
</script>
```

**Single timeline:**

```ts
const gsap = useGsap()
const tl = gsap.timeline()
onUnmounted(() => tl.kill())
```

→ [gsap.context() docs](https://gsap.com/docs/v3/GSAP/gsap.context())

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  bun install --frozen-lockfile
  
  # Generate type stubs
  bun run dev:prepare

  # Install Chromium once for browser and page-transition tests
  bunx playwright install chromium
  
  # Develop with the playground
  bun run dev
  
  # Build the playground
  bun run dev:build
  
  # Run ESLint
  bun run lint
  
  # Run the complete test suite, or a focused suite
  bun run test
  bun run test:unit
  bun run test:ssr
  bun run test:browser
  bun run test:watch

  # Run the complete release gate
  bun run check

  # Coverage, bundle budgets, and consumer compatibility
  bun run test:coverage
  bun run prepack && bun run test:bundle
  NUXT_VERSION=3.21.11 bun run test:compat
  NUXT_VERSION=4.6.2 bun run test:compat
  
  # Release a semver increment
  bun run release:patch
  bun run release:minor
  bun run release:major
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://npmx.dev/api/registry/badge/version/gsap-nuxt-module?style=shieldsio&labelColor=020420&color=00DC82
[npm-version-href]: https://npmx.dev/package/gsap-nuxt-module
[npm-downloads-src]: https://npmx.dev/api/registry/badge/downloads/gsap-nuxt-module?style=shieldsio&labelColor=020420&color=00DC82
[npm-downloads-href]: https://npmx.dev/package/gsap-nuxt-module
[npm-size-src]: https://npmx.dev/api/registry/badge/size/gsap-nuxt-module?style=shieldsio&labelColor=020420&color=00DC82
[npm-size-href]: https://npmx.dev/package/gsap-nuxt-module
[license-src]: https://npmx.dev/api/registry/badge/license/gsap-nuxt-module?style=shieldsio&labelColor=020420&color=00DC82
[license-href]: https://npmx.dev/package/gsap-nuxt-module
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
