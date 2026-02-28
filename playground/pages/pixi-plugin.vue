<script setup>
const appRef = ref(null)
let pixiApp = null
let pixiTween = null

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.4/pixi.min.js'
  script.onload = () => {
    pixiApp = new window.PIXI.Application({ width: 800, height: 600 })
    appRef.value.appendChild(pixiApp.view)

    const graphics = new window.PIXI.Graphics()
    graphics.beginFill(0xDE3249)
    const pixiObject = graphics.drawRect(50, 50, 100, 100)
    graphics.endFill()

    pixiTween = gsap.to(pixiObject, {
      pixi: { x: 500, scaleX: 2, scaleY: 1.5, skewX: 30, rotation: 60 },
      duration: 1,
      ease: 'expo.inOut',
    })

    pixiApp.stage.addChild(graphics)
  }
  document.head.appendChild(script)
})

onUnmounted(() => {
  pixiTween?.kill()
  pixiApp?.destroy(true)
  pixiTween = null
  pixiApp = null
})
</script>

<template>
  <main ref="appRef" />
</template>

<style scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    overscroll-behavior: none;
}
</style>
