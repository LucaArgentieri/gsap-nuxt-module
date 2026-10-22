<script setup lang="ts">
import type { Draggable as DraggablePlugin } from 'gsap/all'

const Draggable = useDraggable()
type LogoComponentRef = { $el: HTMLElement }
type Demo = { label: string, description: string, path: string, icon: string, group: string }

const nuxtLogoRef = ref<LogoComponentRef | null>(null)
const gsapLogoRef = ref<LogoComponentRef | null>(null)
const search = ref('')
let draggables: DraggablePlugin[] = []

onMounted(() => {
  if (!Draggable || !nuxtLogoRef.value || !gsapLogoRef.value) return
  draggables = [...Draggable.create(nuxtLogoRef.value.$el), ...Draggable.create(gsapLogoRef.value.$el)]
})

onUnmounted(() => {
  draggables.forEach(instance => instance.kill())
  draggables = []
})

const demos: Demo[] = [
  { label: 'useGsap', description: 'GSAP core, timelines and automatic cleanup.', path: '/use-gsap', icon: 'i-lucide-sparkles', group: 'Core' },
  { label: 'Context', description: 'Scoped selectors and context-safe handlers.', path: '/use-gsap-context', icon: 'i-lucide-box-select', group: 'Core' },
  { label: 'Timeline', description: 'Lifecycle-aware timelines across navigation.', path: '/use-gsap-timeline', icon: 'i-lucide-timer', group: 'Core' },
  { label: 'Auto-scope', description: 'Component-local selectors with zero boilerplate.', path: '/auto-scope', icon: 'i-lucide-scan', group: 'Core' },
  { label: 'No transition', description: 'Cleanup without a page transition.', path: '/no-transition', icon: 'i-lucide-circle-slash', group: 'Core' },
  { label: 'Page transition', description: 'GSAP leave and enter navigation hooks.', path: '/page-transition', icon: 'i-lucide-panels-top-left', group: 'Core' },
  { label: 'Draggable', description: 'Pointer and touch-driven movement.', path: '/draggable', icon: 'i-lucide-hand', group: 'Interaction' },
  { label: 'Flip', description: 'Animate seamlessly between layout states.', path: '/flip', icon: 'i-lucide-panels-top-left', group: 'Interaction' },
  { label: 'Observer', description: 'Unify wheel, touch and pointer input.', path: '/observer', icon: 'i-lucide-mouse-pointer-2', group: 'Interaction' },
  { label: 'Inertia', description: 'Natural momentum after interaction.', path: '/inertia', icon: 'i-lucide-gauge', group: 'Interaction' },
  { label: 'ScrollTrigger', description: 'Coordinate animation with scroll position.', path: '/scroll-trigger', icon: 'i-lucide-scroll-text', group: 'Scroll' },
  { label: 'ScrollSmoother', description: 'Smooth scrolling with native effects.', path: '/scroll-smoother', icon: 'i-lucide-waves', group: 'Scroll' },
  { label: 'ScrollToPlugin', description: 'Animate window and element scrolling.', path: '/scroll-to-plugin', icon: 'i-lucide-move-down', group: 'Scroll' },
  { label: 'SplitText', description: 'Animate characters, words and lines.', path: '/split-text', icon: 'i-lucide-case-sensitive', group: 'SVG & text' },
  { label: 'TextPlugin', description: 'Tween text content progressively.', path: '/text-plugin', icon: 'i-lucide-text-cursor-input', group: 'SVG & text' },
  { label: 'ScrambleText', description: 'Decode text with a scramble effect.', path: '/scramble-text', icon: 'i-lucide-binary', group: 'SVG & text' },
  { label: 'MotionPath', description: 'Move elements along a custom path.', path: '/motion-path-plugin', icon: 'i-lucide-route', group: 'SVG & text' },
  { label: 'MorphSVG', description: 'Morph one SVG shape into another.', path: '/morph-svg', icon: 'i-lucide-shapes', group: 'SVG & text' },
  { label: 'DrawSVG', description: 'Reveal SVG strokes with precision.', path: '/draw-svg', icon: 'i-lucide-pen-tool', group: 'SVG & text' },
  { label: 'CustomEase', description: 'Build a bespoke animation curve.', path: '/custom-ease', icon: 'i-lucide-chart-spline', group: 'Easing & tools' },
  { label: 'CustomBounce', description: 'Generate configurable bounce physics.', path: '/custom-bounce', icon: 'i-lucide-circle-dot', group: 'Easing & tools' },
  { label: 'CustomWiggle', description: 'Create organic wiggle eases.', path: '/custom-wiggle', icon: 'i-lucide-audio-waveform', group: 'Easing & tools' },
  { label: 'ExpoScaleEase', description: 'Smooth exponential scale changes.', path: '/expo-scale', icon: 'i-lucide-scaling', group: 'Easing & tools' },
  { label: 'RoughEase', description: 'Add controlled randomness to motion.', path: '/rough-ease', icon: 'i-lucide-zap', group: 'Easing & tools' },
  { label: 'SlowMo', description: 'Ease into a dramatic slow-motion beat.', path: '/slow-mo', icon: 'i-lucide-snail', group: 'Easing & tools' },
  { label: 'Physics2D', description: 'Velocity, gravity and acceleration.', path: '/physics-2d', icon: 'i-lucide-orbit', group: 'Easing & tools' },
  { label: 'EaselPlugin', description: 'Animate CreateJS display objects.', path: '/easel-plugin', icon: 'i-lucide-palette', group: 'Easing & tools' },
  { label: 'PixiPlugin', description: 'Animate PixiJS properties and filters.', path: '/pixi-plugin', icon: 'i-lucide-gamepad-2', group: 'Easing & tools' },
  { label: 'GSAPDevTools', description: 'Inspect and control animation timelines.', path: '/gsap-dev-tools', icon: 'i-lucide-wrench', group: 'Easing & tools' },
]

const groups = ['Core', 'Interaction', 'Scroll', 'SVG & text', 'Easing & tools']
const visibleGroups = computed(() => {
  const query = search.value.trim().toLowerCase()
  return groups.map(label => ({
    label,
    demos: demos.filter(demo => demo.group === label && (!query || `${demo.label} ${demo.description}`.toLowerCase().includes(query))),
  })).filter(group => group.demos.length)
})

definePageMeta({ pageTransition })
</script>

<template>
  <main class="home">
    <UPageHero
      orientation="horizontal"
      title="GSAP for Nuxt, without the friction."
      description="Auto-imported, tree-shakeable GSAP plugins with lifecycle-safe composables designed for SSR and page transitions."
      class="hero"
    >
      <template #headline>
        <div class="hero-headline">
          <UBadge
            label="Nuxt 3 & 4 ready"
            icon="i-lucide-badge-check"
            variant="subtle"
          />
        </div>
      </template>

      <template #links>
        <UButton
          to="#demos"
          label="Explore demos"
          icon="i-lucide-arrow-down"
          size="xl"
        />
        <UButton
          to="https://lucaargentieri.github.io/gsap-nuxt-module/"
          target="_blank"
          label="Read documentation"
          trailing-icon="i-lucide-arrow-up-right"
          color="neutral"
          variant="outline"
          size="xl"
        />
      </template>

      <UPageCard
        variant="subtle"
        class="logo-stage"
      >
        <template #header>
          <div class="stage-header">
            <span>Live Draggable demo</span>
            <UBadge
              label="Interactive"
              color="neutral"
              variant="subtle"
            />
          </div>
        </template>
        <div class="logos">
          <NuxtLogo ref="nuxtLogoRef" />
          <span class="plus">+</span>
          <GSAPLogo ref="gsapLogoRef" />
        </div>
        <template #footer>
          <p class="stage-hint">
            <UIcon name="i-lucide-hand" /> Grab either logo and move it around.
          </p>
        </template>
      </UPageCard>
    </UPageHero>

    <section
      id="demos"
      class="demos-section"
    >
      <UContainer>
        <div class="section-heading">
          <div>
            <p class="eyebrow">
              Examples
            </p><h2>Plugins and composables</h2><p>Focused examples for every integration shipped with the module.</p>
          </div>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Filter demos…"
            aria-label="Filter demos"
            size="lg"
            class="search"
          />
        </div>
        <div
          v-for="group in visibleGroups"
          :key="group.label"
          class="demo-group"
        >
          <h3>{{ group.label }}</h3>
          <UPageGrid class="demo-grid">
            <UPageCard
              v-for="demo in group.demos"
              :key="demo.path"
              :to="demo.path"
              :icon="demo.icon"
              :title="demo.label"
              :description="demo.description"
              variant="outline"
              spotlight
              class="demo-card"
            />
          </UPageGrid>
        </div>
        <UAlert
          v-if="!visibleGroups.length"
          title="No demos found"
          description="Try a different plugin or feature name."
          icon="i-lucide-search-x"
          color="neutral"
          variant="subtle"
        />
      </UContainer>
    </section>
  </main>
</template>

<style scoped>
.home { min-height: 100svh; }
.hero { padding-top: 4rem; background: radial-gradient(circle at 75% 20%, color-mix(in srgb, var(--ui-primary) 10%, transparent), transparent 30%); }
.hero-headline, .eyebrow, .demo-group > h3 { font-family: var(--font-mono); }
.logo-stage { overflow: hidden; }
.stage-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: var(--ui-text-highlighted); font-weight: 600; }
.logos { display: flex; min-height: 230px; align-items: center; justify-content: center; gap: 1rem; color: var(--ui-text-highlighted); }
.logos :deep(svg) { cursor: grab; touch-action: none; }
.logos :deep(svg:active) { cursor: grabbing; }
.plus { color: var(--ui-text-dimmed); font-size: 1.5rem; }
.stage-hint { display: flex; align-items: center; gap: .5rem; color: var(--ui-text-muted); font-size: .875rem; }
.demos-section { scroll-margin-top: 4rem; padding: 5rem 0 7rem; border-top: 1px solid var(--ui-border); background: var(--ui-bg-muted); }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 3.5rem; }
.eyebrow { margin-bottom: .5rem; color: var(--ui-primary); font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
h2 { color: var(--ui-text-highlighted); font-size: clamp(1.875rem, 4vw, 2.25rem); font-weight: 600; letter-spacing: -.025em; }
.section-heading div > p:last-child { margin-top: .5rem; color: var(--ui-text-muted); }
.search { width: min(100%, 300px); }
.demo-group + .demo-group { margin-top: 3rem; }
h3 { margin-bottom: 1rem; color: var(--ui-text-highlighted); font-size: .8125rem; font-weight: 600; }
.demo-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .875rem; }
.demo-card { height: 100%; }
@media (max-width: 960px) { .demo-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .section-heading { align-items: stretch; flex-direction: column; } .search { width: 100%; } .demo-grid { grid-template-columns: 1fr; } .logos { min-height: 180px; transform: scale(.82); } }
</style>
