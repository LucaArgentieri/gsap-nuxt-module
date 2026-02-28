<script setup lang="ts">
const customEase = useCustomEase()
const box = ref(null)
let tween = null

onMounted(() => {
  tween = gsap.fromTo(box.value, {
    x: -300,
  }, {
    x: 300,
    duration: 1,
    ease: customEase.create('smooth', 'M0,0 C0.25,0.1 0.25,1 1,1'),
    yoyo: true,
    repeat: -1,
  })
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
