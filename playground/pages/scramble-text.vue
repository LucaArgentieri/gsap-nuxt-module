<script setup>
const textRef = ref(null);
let tween = null;

onMounted(() => {
  tween = gsap.to(textRef.value, {
    duration: 1,
    scrambleText: "THIS IS NEW TEXT",
    ease: "expo.inOut",
    duration: 5,
  });
});

onUnmounted(() => {
  tween?.kill();
  tween = null;
});
</script>

<template>
  <main>
    <h1 ref="textRef">Text Plugin</h1>
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

.new-text {
  color: red;
}
</style>
