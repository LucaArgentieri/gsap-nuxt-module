<script setup lang="ts">
const GSDevTools = useGSDevTools()

const nuxtLogoRef = ref(null)
const gsapLogoRef = ref(null)
let devTools = null
let nuxtTween = null
let gsapTween = null

onMounted(() => {
  devTools = GSDevTools?.create()

  nuxtTween = gsap.to(nuxtLogoRef.value.$el, {
    rotation: 360,
    duration: 2,
    repeat: -1,
    ease: 'none',
  })

  gsapTween = gsap.to(gsapLogoRef.value.$el, {
    rotation: -360,
    duration: 2,
    repeat: -1,
    ease: 'none',
  })
})

onUnmounted(() => {
  devTools?.kill()
  nuxtTween?.kill()
  gsapTween?.kill()
  devTools = null
  nuxtTween = null
  gsapTween = null
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
