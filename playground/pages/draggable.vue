<script setup>
const Draggable = useDraggable();

const nuxtLogoRef = ref(null);
let draggables = [];

onMounted(() => {
  draggables = Draggable.create(nuxtLogoRef.value.$el);
});

onUnmounted(() => {
  draggables.forEach((instance) => instance.kill());
  draggables = [];
});
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
