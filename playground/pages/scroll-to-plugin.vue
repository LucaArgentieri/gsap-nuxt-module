<script setup lang="ts">
// const ScrollToPlugin = useScrollToPlugin()

type LogoComponentRef = { $el: HTMLElement };

const nuxtLogoRef = ref<LogoComponentRef | null>(null);
const gsapLogoRef = ref<LogoComponentRef | null>(null);
let tween: gsap.core.Tween | null = null;

onMounted(() => {
  tween = gsap.to(window, {
    duration: 2,
    scrollTo: gsapLogoRef.value!.$el,
    repeat: -1,
    yoyo: true,
    ease: "expo.inOut",
  });

  // ScrollToPlugin.config({ autoKill: true })
});

onUnmounted(() => {
  tween?.kill();
  tween = null;
});

definePageMeta({ pageTransition });
</script>

<template>
  <main>
    <section>
      <NuxtLogo ref="nuxtLogoRef" />
    </section>
    <section>
      <GSAPLogo ref="gsapLogoRef" />
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overscroll-behavior: none;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
  width: 100vw;
}
</style>
