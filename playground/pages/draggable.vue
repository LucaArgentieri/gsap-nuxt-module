<script setup lang="ts">
import type { Draggable as DraggableInstance } from 'gsap/Draggable'

type ComponentRef = { $el: HTMLElement }

const Draggable = useDraggable()

const nuxtLogoRef = ref<ComponentRef | null>(null)
let draggables: DraggableInstance[] = []

onMounted(() => {
  draggables = Draggable.create(nuxtLogoRef.value!.$el)
})

onUnmounted(() => {
  draggables.forEach(instance => instance.kill())
  draggables = []
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
  overscroll-behavior: none;
}
</style>
