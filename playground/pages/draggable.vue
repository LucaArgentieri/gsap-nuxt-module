<script setup lang="ts">
import type { Draggable as DraggablePlugin } from "gsap/all";

type LogoComponentRef = { $el: HTMLElement };

const Draggable = useDraggable();

const nuxtLogoRef = ref<LogoComponentRef | null>(null);
let draggables: DraggablePlugin[] = [];

onMounted(() => {
  draggables = Draggable.create(nuxtLogoRef.value!.$el);
});

onUnmounted(() => {
  draggables.forEach((instance) => instance.kill());
  draggables = [];
});

definePageMeta({ pageTransition });
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
