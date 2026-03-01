<script setup lang="ts">
import type { Draggable as DraggablePlugin } from 'gsap/all'

const Draggable = useDraggable()

type LogoComponentRef = {
  $el: HTMLElement
}

const nuxtLogoRef = ref<LogoComponentRef | null>(null)
const gsapLogoRef = ref<LogoComponentRef | null>(null)

let draggables: DraggablePlugin[] = []

onMounted(() => {
  if (!Draggable || !nuxtLogoRef.value || !gsapLogoRef.value) return
  draggables = [
    ...Draggable.create(nuxtLogoRef.value.$el),
    ...Draggable.create(gsapLogoRef.value.$el),
  ]
})

onUnmounted(() => {
  draggables.forEach(d => d.kill())
  draggables = []
})

const demos = [
  { label: 'useGsap', path: '/use-gsap' },
  { label: 'useGsap (context)', path: '/use-gsap-context' },
  { label: 'ScrollTrigger', path: '/scroll-trigger' },
  { label: 'Draggable', path: '/draggable' },
  { label: 'Flip', path: '/flip' },
  { label: 'Observer', path: '/observer' },
  { label: 'SplitText', path: '/split-text' },
  { label: 'TextPlugin', path: '/text-plugin' },
  { label: 'ScrambleText', path: '/scramble-text' },
  { label: 'ScrollSmoother', path: '/scroll-smoother' },
  { label: 'ScrollToPlugin', path: '/scroll-to-plugin' },
  { label: 'MotionPath', path: '/motion-path-plugin' },
  { label: 'MorphSVG', path: '/morph-svg' },
  { label: 'DrawSVG', path: '/draw-svg' },
  { label: 'CustomEase', path: '/custom-ease' },
  { label: 'CustomBounce', path: '/custom-bounce' },
  { label: 'CustomWiggle', path: '/custom-wiggle' },
  { label: 'ExpoScaleEase', path: '/expo-scale' },
  { label: 'RoughEase', path: '/rough-ease' },
  { label: 'SlowMo', path: '/slow-mo' },
  { label: 'Inertia', path: '/inertia' },
  { label: 'Physics2D', path: '/physics-2d' },
  { label: 'EaselPlugin', path: '/easel-plugin' },
  { label: 'PixiPlugin', path: '/pixi-plugin' },
  { label: 'GSAPDevTools', path: '/gsap-dev-tools' },
]
</script>

<template>
  <main>
    <section class="hero">
      <p class="hero-label">
        Drag the logos
      </p>
      <div class="logos">
        <NuxtLogo ref="nuxtLogoRef" />
        <GSAPLogo ref="gsapLogoRef" />
      </div>
    </section>

    <section class="demos">
      <h2>Plugin & Composable Demos</h2>
      <div class="grid">
        <NuxtLink
          v-for="demo in demos"
          :key="demo.path"
          :to="demo.path"
          class="card"
        >
          {{ demo.label }}
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  overscroll-behavior: none;
}

.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100svh;
  overflow: hidden;
}

.hero-label {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

.logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.demos {
  padding: 60px 40px;
}

h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 32px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  border: 1px solid #333;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.card:hover {
  border-color: #88ce02;
  background: rgba(136, 206, 2, 0.05);
  color: #88ce02;
}
</style>
