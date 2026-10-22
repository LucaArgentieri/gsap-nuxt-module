<template>
  <div class="no-transition-page">
    <div
      ref="boxRef"
      class="no-transition-box"
    />
    <NuxtLink to="/other">Go to other page</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ pageTransition: false })

const boxRef = ref<HTMLElement | null>(null)

useGsap(() => {
  gsap.to(boxRef.value, { x: 100, duration: 1, repeat: -1, yoyo: true })
})

onMounted(() => {
  const testWindow = window as Window & { __noTransitionBox?: HTMLElement }
  if (boxRef.value) testWindow.__noTransitionBox = boxRef.value
})
</script>

<style scoped>
.no-transition-box {
  width: 20px;
  height: 20px;
  background: blue;
}
</style>
