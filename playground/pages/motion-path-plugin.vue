<script setup lang="ts">
type LogoComponentRef = { $el: HTMLElement }

const nuxtLogoRef = ref<LogoComponentRef | null>(null)
const MotionPathHelper = useMotionPathHelper()
let helper: { kill: () => void } | null = null
let tween: gsap.core.Tween | null = null

onMounted(() => {
  const nuxtLogo = nuxtLogoRef.value!.$el
  const path = [
    { x: -50, y: -50 },
    { x: -50, y: 50 },
    { x: 50, y: 50 },
    { x: 50, y: -50 },
    { x: -50, y: -50 },
  ]

  tween = gsap.to(nuxtLogo, {
    duration: 5,
    motionPath: {
      path,
      autoRotate: true,
      start: 0,
      end: 1,
    },
    repeat: -1,
    yoyo: true,
    ease: 'linear',
  })

  helper = MotionPathHelper?.create(tween)
})

onUnmounted(() => {
  helper?.kill()
  tween?.kill()
})

definePageMeta({ pageTransition })
</script>

<template>
  <main>
    <NuxtLogo ref="nuxtLogoRef" />
  </main>
</template>

<style scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    height: 100svh;
    overflow: hidden;
    overscroll-behavior: none;
}
</style>
