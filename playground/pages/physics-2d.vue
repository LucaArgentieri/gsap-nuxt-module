<script setup lang="ts">
type LogoComponentRef = {
  $el: HTMLElement
}

const nuxtLogoRef = ref<LogoComponentRef | null>(null)
const gsapLogoRef = ref<LogoComponentRef | null>(null)
let tween: ReturnType<typeof gsap.to> | null = null

onMounted(() => {
  if (!nuxtLogoRef.value || !gsapLogoRef.value) return

  tween = gsap.to([nuxtLogoRef.value.$el, gsapLogoRef.value.$el], {
    duration: 2,
    physics2D: { velocity: 300, angle: -60, gravity: 400 },
    stagger: 0.4,
    physicsProps: {
      x: { velocity: 100, acceleration: 200 },
      y: { velocity: -200, friction: 0.1 },
    },
  })
})

onUnmounted(() => {
  tween?.kill()
  tween = null
})
</script>

<template>
  <main>
    <NuxtLogo ref="nuxtLogoRef" />
    <GSAPLogo ref="gsapLogoRef" />
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
