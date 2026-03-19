<script setup lang="ts">
import { gsap } from 'gsap'

function onBeforeLeave(el: Element) {
  gsap.set(el, { opacity: 1 })
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done })
}

function onEnter(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out', onComplete: done },
  )
}

function onAfterEnter(el: Element) {
  gsap.set(el, { clearProps: 'all' })
}
</script>

<template>
  <Transition
    :css="false"
    mode="out-in"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @enter="onEnter"
    @after-enter="onAfterEnter"
  >
    <NuxtPage />
  </Transition>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
