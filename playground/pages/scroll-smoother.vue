<script setup lang="ts">
const ScrollSmoother = useScrollSmoother()

const nuxtLogoRef = ref(null)
const gsapLogoRef = ref(null)

onMounted(() => {
  ScrollSmoother.create({
    smooth: 1,
    effects: true, // looks for data-speed and data-lag attributes on elements
    smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
  })
})
</script>

<template>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <!--- ALL YOUR CONTENT HERE --->
      <main>
        <NuxtLogo ref="nuxtLogoRef" />
        <GSAPLogo ref="gsapLogoRef" />
      </main>
    </div>
  </div>
  <!-- position: fixed elements can go outside --->
</template>

<style scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    height: 300svh;
}
</style>
