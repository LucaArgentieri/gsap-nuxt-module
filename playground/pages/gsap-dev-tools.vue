<script setup lang="ts">
const GSDevTools = useGSDevTools()

type LogoComponentRef = {
  $el: HTMLElement
}

const nuxtLogoRef = ref<LogoComponentRef | null>(null)
const gsapLogoRef = ref<LogoComponentRef | null>(null)
let devTools: { kill: () => void } | null = null
let nuxtTween: ReturnType<typeof gsap.to> | null = null
let gsapTween: ReturnType<typeof gsap.to> | null = null

onMounted(() => {
  if (!nuxtLogoRef.value || !gsapLogoRef.value) return

  devTools = GSDevTools ? GSDevTools.create() : null

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
