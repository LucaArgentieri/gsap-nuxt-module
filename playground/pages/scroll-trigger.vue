<script setup lang="ts">
const ScrollTrigger = useScrollTrigger();

const nuxtLogoRef = ref(null);
const gsapLogoRef = ref(null);
let animations = [];

onMounted(() => {
  const nuxtLogo = nuxtLogoRef.value.$el;
  const gsapLogo = gsapLogoRef.value.$el;

  console.log("ScrollTrigger.create:", ScrollTrigger.create);

  const nuxtTween = gsap.fromTo(
    nuxtLogo,
    {
      x: -500,
    },
    {
      x: 500,
      scrollTrigger: {
        trigger: nuxtLogo,
        start: "top+=100px center",
        end: "bottom center",
        markers: true,
      },
    },
  );

  const gsapTween = gsap.fromTo(
    gsapLogo,
    {
      x: -500,
    },
    {
      x: 500,
      scrollTrigger: {
        trigger: gsapLogo,
        start: "top center",
        end: "bottom center",
        scrub: true,
        markers: true,
      },
    },
  );

  animations = [nuxtTween, gsapTween];
});

onUnmounted(() => {
  animations.forEach((animation) => animation.kill());
  animations = [];
});
</script>

<template>
  <main>
    <div class="nav">
      <NuxtLink to="/">← Back</NuxtLink>
    </div>
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
  overscroll-behavior: none;
}

.nav {
  position: fixed;
  top: 16px;
  left: 20px;
  z-index: 10;
}

.nav a {
  color: #88ce02;
  text-decoration: none;
  font-family: sans-serif;
  font-size: 0.9rem;
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
