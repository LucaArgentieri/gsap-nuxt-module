<script setup lang="ts">
const props = defineProps<{
  title: string
  animation: 'bounce' | 'spin'
}>()

const gsap = useGsap()

// No `scope` passed: the context auto-scopes to this component's root element,
// so the generic `.box` selector only matches boxes inside THIS card.
useGsap(() => {
  if (props.animation === 'bounce') {
    gsap.to('.box', {
      y: -30,
      duration: 0.5,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.1,
    })
  }
  else {
    gsap.to('.box', {
      rotation: 360,
      duration: 1.5,
      ease: 'none',
      repeat: -1,
      stagger: 0.2,
    })
  }
})
</script>

<template>
  <section class="card">
    <h2>{{ title }}</h2>
    <div class="boxes">
      <div class="box" />
      <div class="box" />
      <div class="box" />
    </div>
  </section>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 30px;
  border: 1px solid #333;
  border-radius: 8px;
}

h2 {
  font-size: 1.1rem;
  margin: 0;
}

.boxes {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  height: 110px;
}

.box {
  width: 50px;
  height: 50px;
  background: #88ce02;
  border-radius: 6px;
  will-change: transform;
}
</style>
