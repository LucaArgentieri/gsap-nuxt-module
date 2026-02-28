<script setup lang="ts">
const CustomWiggle = useCustomWiggle()
const box = ref<HTMLElement | null>(null)
let tween: ReturnType<typeof gsap.to> | null = null

onMounted(() => {
  if (!CustomWiggle || !box.value) return

  CustomWiggle.create('myWiggle', { wiggles: 15 })

  tween = gsap.to(box.value, { y: 60, x: 60, duration: 2, rotation: 30, ease: 'myWiggle' })
})

onUnmounted(() => {
  tween?.kill()
  tween = null
})
</script>

<template>
  <main>
    <div
      ref="box"
      class="box"
    />
  </main>
</template>

<style scoped>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        overscroll-behavior: none;
    }

    .box {
        width: 100px;
        height: 100px;
        background-color: #61dafb;
        border-radius: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
</style>
