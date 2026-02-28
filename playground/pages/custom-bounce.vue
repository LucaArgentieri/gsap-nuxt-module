<script setup lang="ts">
const CustomBounce = useCustomBounce()
const box = ref<HTMLElement | null>(null)
let bounceTween: ReturnType<typeof gsap.from> | null = null
let squashTween: ReturnType<typeof gsap.to> | null = null

onMounted(() => {
  if (!CustomBounce || !box.value) return

  // Create a custom bounce ease:
  CustomBounce.create('myBounce', {
    strength: 0.6,
    squash: 3,
    squashID: 'myBounce-squash',
  })

  // do the bounce by affecting the "y" property.
  bounceTween = gsap.from(box.value, { duration: 2, y: -200, ease: 'myBounce' })

  // and do the squash/stretch at the same time:
  squashTween = gsap.to(box.value, {
    duration: 2,
    scaleX: 1.4,
    scaleY: 0.3,
    ease: 'myBounce-squash',
    transformOrigin: 'center bottom',
  })
})

onUnmounted(() => {
  bounceTween?.kill()
  squashTween?.kill()
  bounceTween = null
  squashTween = null
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
