<script setup>
const SplitText = useSplitText()
const textRef = ref(null)

onMounted(() => {
  const split = SplitText.create(textRef.value, { type: 'words, chars' })

  // now animate the characters in a staggered fashion
  gsap.from(split.chars, {
    duration: 1,
    y: 100, // animate from 100px below
    autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
    stagger: 0.05, // 0.05 seconds between each
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
