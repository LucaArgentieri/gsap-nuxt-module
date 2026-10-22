<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <UApp>
    <UHeader
      :toggle="false"
      class="app-header"
    >
      <template #title>
        <NuxtLink
          to="/"
          class="brand"
          aria-label="GSAP Nuxt Module playground"
        >
          <span class="brand-mark">G</span>
          <span>GSAP Nuxt</span>
          <UBadge
            label="Playground"
            color="neutral"
            variant="subtle"
            size="sm"
          />
        </NuxtLink>
      </template>

      <template #right>
        <nav
          class="header-actions"
          aria-label="Primary navigation"
        >
          <UButton
            v-if="!isHome"
            to="/"
            label="All demos"
            icon="i-lucide-layout-grid"
            color="neutral"
            variant="ghost"
          />
          <UButton
            to="https://lucaargentieri.github.io/gsap-nuxt-module/"
            target="_blank"
            aria-label="Documentation"
            icon="i-lucide-book-open"
            color="neutral"
            variant="ghost"
            class="desktop-action"
          />
          <UButton
            to="https://github.com/LucaArgentieri/gsap-nuxt-module"
            target="_blank"
            aria-label="GitHub repository"
            icon="i-lucide-github"
            color="neutral"
            variant="ghost"
          />
          <UColorModeButton color="neutral" />
        </nav>
      </template>
    </UHeader>
    <NuxtPage />
  </UApp>
</template>

<style>
.app-header { position: fixed; inset: 0 0 auto; z-index: 50; background: color-mix(in srgb, var(--ui-bg) 85%, transparent); backdrop-filter: blur(12px); }
.brand, .header-actions { display: flex; align-items: center; }
.brand { gap: .625rem; color: var(--ui-text-highlighted); font-weight: 600; text-decoration: none; }
.brand-mark { display: grid; width: 1.75rem; height: 1.75rem; place-items: center; border-radius: var(--ui-radius); background: var(--ui-primary); color: var(--ui-bg); font-weight: 700; }
.header-actions { gap: .25rem; }
@media (max-width: 520px) { .desktop-action, .brand [data-slot="base"] { display: none; } }
</style>
