<script setup>
onMounted(() => {
  gsap.to('#lineSvg', {
    drawSVG: '0% 50%',
    duration: 2,
    repeat: -1,
    yoyo: true,
  })

  gsap.from('#circleSvg circle', {
    drawSVG: '50% 50%',
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  })
})
</script>

<template>
  <main>
    <svg
      width="200"
      height="200"
    >
      <path
        id="lineSvg"
        d="M10 10 L 190 190"
        stroke="black"
        stroke-width="2"
        fill="none"
      />
    </svg>

    <svg
      id="circleSvg"
      width="200"
      height="200"
    >
      <circle
        cx="100"
        cy="100"
        r="50"
        stroke="black"
        stroke-width="4"
        fill="none"
      />
    </svg>
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
}
</style>
