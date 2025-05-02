<script setup>
const textRef = ref(null)

onMounted(() => {
  gsap.to(textRef.value, {
    duration: 1,
    scrambleText: 'THIS IS NEW TEXT',
    ease: 'expo.inOut',
    duration: 5,

  })
})
</script>

<template>
  <main>
    <h1 ref="textRef">
      Text Plugin
    </h1>
  </main>
</template>

<style>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    height: 100svh;
    overflow: hidden;
}

.new-text {
    color: red;

}
</style>
