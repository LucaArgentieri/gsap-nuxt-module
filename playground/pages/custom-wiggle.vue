<script setup lang="ts">
const CustomWiggle = useCustomWiggle()
const box = ref(null)

onMounted(() => {
  CustomWiggle.create('myWiggle', { wiggles: 15 })

  gsap.to(box.value, { y: 60, x: 60, duration: 2, rotation: 30, ease: 'myWiggle' })
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
    }

    .box {
        width: 100px;
        height: 100px;
        background-color: #61dafb;
        border-radius: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
</style>
