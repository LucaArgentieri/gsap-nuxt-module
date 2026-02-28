<script setup>
const nuxtLogoRef = ref(null)
let tween = null

onMounted(() => {
  // use the default SlowMo ease (linearRatio of 0.7 and power of 0.7)
  // gsap.to(nuxtLogoRef.value.$el, { duration: 5, x: 600, ease: 'slow' })

  // this gives the exact same effect as the line above, but uses a different syntax
  tween = gsap.to(nuxtLogoRef.value.$el, { duration: 5, x: window.innerWidth, y: window.innerHeight, ease: 'slow(0.5, 0.8)' })

  // now let's create an opacity tween that syncs with the above positional tween, fading it in at the beginning and out at the end
  // gsap.from(nuxtLogoRef.value.$el, { duration: 5, opacity: 0, ease: 'slow(0.5, 0.8, true)' })
})

onUnmounted(() => {
  tween?.kill()
  tween = null
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
    gap: 20px;
    height: 100svh;
    overflow: hidden;
    overscroll-behavior: none;
}
</style>
