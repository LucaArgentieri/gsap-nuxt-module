<script setup>
const easelContainer = ref(null)
let ticker = null
let tween = null

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://code.createjs.com/easeljs-0.8.2.min.js'
  script.onload = () => {
    const stage = new window.createjs.Stage(easelContainer.value)
    const circle = new window.createjs.Shape()
    circle.graphics.beginFill('red').drawCircle(0, 0, 50)
    circle.x = circle.y = 100
    stage.addChild(circle)

    ticker = () => stage.update()
    gsap.ticker.add(ticker)

    tween = gsap.to(circle, {
      duration: 2,
      scaleX: 0.5,
      scaleY: 0.5,
      easel: { tint: 0x00FF00 },
      repeat: -1,
      yoyo: true,
    })
  }
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (ticker) gsap.ticker.remove(ticker)
  tween?.kill()
  ticker = null
  tween = null
})
</script>

<template>
  <canvas
    ref="easelContainer"
    class="easel-container"
  />
</template>

<style scoped>
.easel-container {
  width: 100%;
  overscroll-behavior: none;
}
</style>
