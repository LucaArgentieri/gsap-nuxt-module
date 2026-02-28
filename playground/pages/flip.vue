<script setup>
const Flip = useFlip()
const box = ref(null)
const circle = ref(null)
let animation = null

onMounted(() => {
  const squares = gsap.utils.toArray([box.value, circle.value])

  const doFlip = () => {
  // Get the initial state
    const state = Flip.getState(squares)

    // Make DOM or styling changes (swap the squares in our case)
    swap(squares)

    // Animate from the initial state to the end state
    animation = Flip.from(state, { duration: 2, ease: 'power1.inOut', repeat: -1, yoyo: true })
  }

  // Given an Array of two siblings, append the one that's first so it's last (swap)
  const swap = ([a, b]) => {
    return a.parentNode.children[0] === a ? a.parentNode.appendChild(a) : a.parentNode.appendChild(b)
  }

  doFlip()
})

onUnmounted(() => {
  animation?.kill()
  animation = null
})
</script>

<template>
  <main>
    <div
      ref="box"
      class="box"
    />
    <div
      ref="circle"
      class="circle"
    />
  </main>
</template>

<style scoped>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        overscroll-behavior: none;
    }

    .box {
        width: 100px;
        height: 100px;
        background-color: #ff6c1c;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .circle {
        width: 100px;
        height: 100px;
        background-color: #61dafb;
        border-radius: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
</style>
