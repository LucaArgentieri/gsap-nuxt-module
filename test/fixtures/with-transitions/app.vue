<template>
  <div>
    <div
      ref="sharedRef"
      class="shared-animation"
    >
      Shared UI
    </div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const sharedRef = ref<HTMLElement | null>(null)

// Verifies that useGsap also works in shared UI outside <NuxtPage>.
useGsap(() => {
  gsap.to(sharedRef.value, { x: 10, duration: 0.1 })
})
</script>

<style>
.page-leave-active {
  transition: opacity 300ms linear;
}

.page-leave-to {
  opacity: 0;
}
</style>
