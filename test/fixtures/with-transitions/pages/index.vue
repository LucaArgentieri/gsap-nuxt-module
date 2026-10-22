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
const router = useRouter()

// `cleanupOn` remains accepted for backward compatibility. Cleanup is managed
// by the module and must not interrupt Nuxt's leave transition.
useGsap(
  () => {
    gsap.to(boxRef.value, { x: 200, duration: 1, repeat: -1, yoyo: true })
  },
  { cleanupOn: 'route-leave' },
)

onMounted(() => {
  const testWindow = window as Window & {
    __transitionBox?: HTMLElement
    __testRouter?: typeof router
  }
  if (boxRef.value) testWindow.__transitionBox = boxRef.value
  testWindow.__testRouter = router
})
</script>

<style scoped>
.box {
  width: 20px;
  height: 20px;
  background: green;
}
</style>
