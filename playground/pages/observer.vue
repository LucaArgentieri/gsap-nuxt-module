<script setup>
const Observer = useObserver()

const nuxtLogoRef = ref(null)
const gsapLogoRef = ref(null)
let observer = null

const next = () => {
  gsap.to(gsapLogoRef.value.$el, {
    x: 0,
    y: 0,
    duration: 1,
  })
  gsap.to(nuxtLogoRef.value.$el, {
    x: 100,
    y: 100,
    duration: 1,
  })
}

const previous = () => {
  gsap.to(nuxtLogoRef.value.$el, {
    x: 0,
    y: 0,
    duration: 1,
  })
  gsap.to(gsapLogoRef.value.$el, { x: 100, y: 100, duration: 1 })
}

onMounted(() => {
  observer = Observer.create({
    target: window,
    type: 'wheel,touch',
    onUp: () => previous(),
    onDown: () => next(),
  })
})

onUnmounted(() => {
  observer?.kill()
  observer = null
})
</script>

<template>
  <main>
    <section>
      <NuxtLogo ref="nuxtLogoRef" />
    </section>
    <section>
      <GSAPLogo ref="gsapLogoRef" />
    </section>
  </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overscroll-behavior: none;
}

section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    height: 100vh;
    width: 100vw;
}
</style>
