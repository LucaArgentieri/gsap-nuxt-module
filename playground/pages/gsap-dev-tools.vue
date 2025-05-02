<script setup lang="ts">
const GSDevTools = useGSDevTools()

const nuxtLogoRef = ref(null)
const gsapLogoRef = ref(null)

onMounted(() => {
  GSDevTools.create()

  gsap.to(nuxtLogoRef.value.$el, {
    rotation: 360,
    duration: 2,
    repeat: -1,
    ease: 'none',
  })

  gsap.to(gsapLogoRef.value.$el, {
    rotation: -360,
    duration: 2,
    repeat: -1,
    ease: 'none',
  })
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
}
</style>
