<script setup lang="ts">
const gsap = useGsap()
const boxRef = ref<HTMLDivElement | null>(null)
let tl: ReturnType<typeof gsap.timeline> | null = null

onMounted(() => {
  tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(boxRef.value, { x: 200, duration: 1, ease: 'power2.inOut' })
    .to(boxRef.value, { rotation: 360, duration: 0.8 })
    .to(boxRef.value, { scale: 1.5, duration: 0.5 })
})

onUnmounted(() => {
  tl?.kill()
  tl = null
})
</script>

<template>
  <main>
    <h1>useGsap()</h1>
    <p>Returns the GSAP instance for direct use — timeline, tweens, easing.</p>
    <div class="stage">
      <div
        ref="boxRef"
        class="box"
      />
    </div>
    <NuxtLink to="/">← Back</NuxtLink>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 100svh;
  padding: 40px 20px;
  font-family: sans-serif;
  overscroll-behavior: none;
}

h1 {
  font-size: 2rem;
  margin: 0;
}

p {
  color: #888;
  margin: 0;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
}

.box {
  width: 80px;
  height: 80px;
  background: #88ce02;
  border-radius: 8px;
}

a {
  color: #88ce02;
  text-decoration: none;
  font-size: 0.9rem;
}
</style>
