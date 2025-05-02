<script setup>
const nuxtLogoRef = ref(null)
const MotionPathHelper = useMotionPathHelper()

onMounted(() => {
  const nuxtLogo = nuxtLogoRef.value.$el
  const path = [
    { x: -50, y: -50 },
    { x: -50, y: 50 },
    { x: 50, y: 50 },
    { x: 50, y: -50 },
    { x: -50, y: -50 },
  ]

  const tween = gsap.to(nuxtLogo, {
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

  MotionPathHelper.create(tween)
})
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
}
</style>
