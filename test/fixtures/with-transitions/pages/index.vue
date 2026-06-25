<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="gsap-page">
    <div
      ref="boxRef"
      class="box"
    />
    <NuxtLink to="/other">Go to other page</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const boxRef = ref<HTMLElement | null>(null)

// `cleanupOn` is accepted for backward compatibility, but cleanup still happens
// during component teardown.
useGsap(
  () => {
    gsap.to(boxRef.value, { x: 200, duration: 1, repeat: -1, yoyo: true })
  },
  { cleanupOn: 'route-leave' },
)
</script>
