---
title: gsap-nuxt-module
description: GSAP integration for Nuxt — auto-import, plugin composables, and zero-overhead tree-shaking.
seo:
  title: gsap-nuxt-module
  description: GSAP integration for Nuxt — auto-import, plugin composables, and zero-overhead tree-shaking.
---

::u-page-hero
---
links:
  - label: Get started
    to: /getting-started/installation
    icon: i-lucide-rocket
    size: xl
  - label: GitHub
    to: https://github.com/LucaArgentieri/gsap-nuxt-module
    icon: i-simple-icons-github
    color: neutral
    variant: subtle
    size: xl
    target: _blank
---

#title
GSAP for Nuxt

#description
Auto-import GSAP, register only the plugins you need, and animate with composables — zero boilerplate.
::

::u-page-section
#title
Why gsap-nuxt-module?

#description
Everything you need to bring GSAP animations into a Nuxt app — nothing more.

#default
  ::u-page-grid
    ::u-page-card
    ---
    icon: i-lucide-zap
    title: Auto-import GSAP
    description: Use `gsap`, `useGsap()`, and all plugin composables anywhere — no manual imports needed.
    ---
    ::

    ::u-page-card
    ---
    icon: i-lucide-puzzle
    title: Plugin composables
    description: Each GSAP plugin is exposed as a typed composable (useScrollTrigger(), useDraggable(), …) registered only when enabled.
    ---
    ::

    ::u-page-card
    ---
    icon: i-lucide-package-minus
    title: Zero unused overhead
    description: Plugins are dynamically imported only when listed in your nuxt.config.ts — your bundle stays lean.
    ---
    ::

    ::u-page-card
    ---
    icon: i-lucide-shield-check
    title: TypeScript-first
    description: Full type support for all composables and module options out of the box.
    ---
    ::
  ::
::
