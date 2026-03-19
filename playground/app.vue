<script setup lang="ts">
import { gsap } from 'gsap'

function onBeforeLeave(el: Element) {
  gsap.set(el, { opacity: 1 })
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done })
}

function onEnter(el: Element, done: () => void) {
  window.scrollTo(0, 0)
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
  <NuxtPage v-slot="{ Component, route }">
    <Transition
      :css="false"
      mode="out-in"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @enter="onEnter"
      @after-enter="onAfterEnter"
    >
      <component
        :is="Component"
        :key="route.path"
      />
    </Transition>
  </NuxtPage>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
