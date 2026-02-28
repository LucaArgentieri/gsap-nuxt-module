<script setup lang="ts">
import type { Draggable as DraggablePlugin } from 'gsap/all'

const Draggable = useDraggable()

type LogoComponentRef = {
  $el: HTMLElement
}

const nuxtLogoRef = ref<LogoComponentRef | null>(null)
const gsapLogoRef = ref<LogoComponentRef | null>(null)
let draggables: DraggablePlugin[] = []

onMounted(() => {
  if (!Draggable || !nuxtLogoRef.value || !gsapLogoRef.value) return

  draggables = [
    ...Draggable.create(nuxtLogoRef.value.$el, {
      inertia: true,

    }),
    ...Draggable.create(gsapLogoRef.value.$el, {
      inertia: true,
    }),
  ]
})

onUnmounted(() => {
  draggables.forEach(instance => instance.kill())
  draggables = []
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
