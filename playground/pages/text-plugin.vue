<script setup lang="ts">
const textRef = ref<HTMLElement | null>(null)
let tween: gsap.core.Tween | null = null

onMounted(() => {
  tween = gsap.to(textRef.value, {
    text: {
      value: 'Your new text',
      newClass: 'new-text',
      delimiter: ' ',
    },
    ease: 'expo.inOut',
    duration: 5,
  })
})

onUnmounted(() => {
  tween?.kill()
  tween = null
})

definePageMeta({ pageTransition })
</script>

<template>
  <main>
    <h1 ref="textRef">
      Text Plugin
    </h1>
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
