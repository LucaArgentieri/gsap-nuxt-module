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
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

**Enhance your Nuxt application with powerful animations and transitions using GSAP!**

- [🏀 Online playground](https://stackblitz.com/edit/gsap-nuxt-module?file=app.vue)
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

## Available composables

| Composable | Plugin | `nuxt.config.ts` key |
|---|---|---|
| `useGsap()` | GSAP core | — (always available) |
| `useScrollTrigger()` | ScrollTrigger | `ScrollTrigger` |
| `useScrollSmoother()` | ScrollSmoother | `ScrollSmoother` |
| `useSplitText()` | SplitText | `SplitText` |
| `useMotionPathHelper()` | MotionPathHelper | `MotionPathHelper` |
| `useDraggable()` | Draggable | `Draggable` |
| `useFlip()` | Flip | `Flip` |
| `useObserver()` | Observer | `Observer` |
| `useGSDevTools()` | GSDevTools | `GSDevTools` |
| `useCustomEase()` | CustomEase | `CustomEase` |
| `useCustomWiggle()` | CustomWiggle | `CustomWiggle` |
| `useCustomBounce()` | CustomBounce | `CustomBounce` |

## Plugin loading

Only plugins listed in `nuxt.config.ts` are dynamically imported —
zero bundle overhead for unused plugins.

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

GSAP animations are not automatically cleaned up when a component unmounts.
Use `onUnmounted` to prevent memory leaks.

Do not call `gsap.unregisterPlugin(...)` inside page/components: plugin registration is app-wide.
In components, clean up only the instances created by that component.

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
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/gsap-nuxt-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/gsap-nuxt-module
[npm-downloads-src]: https://img.shields.io/npm/dm/gsap-nuxt-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/gsap-nuxt-module
[license-src]: https://img.shields.io/npm/l/gsap-nuxt-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/gsap-nuxt-module
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
