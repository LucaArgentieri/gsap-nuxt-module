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
