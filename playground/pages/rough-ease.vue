<script setup>
const nuxtLogoRef = ref(null)

onMounted(() => {
  // use the default values
  // gsap.from(nuxtLogoRef.value.$el, { duration: 1, opacity: 0, ease: 'rough' })

  // or customize the configuration
  gsap.to(nuxtLogoRef.value.$el, { duration: 2, y: 150, ease: 'rough({strength: 3, points: 50, template: strong.inOut, taper: both, randomize: false})', repeat: -1, yoyo: true })
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
