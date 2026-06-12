<script setup lang="ts">
const gsap = useGsap()
const actorRef = ref<HTMLDivElement | null>(null)
const elapsed = ref(0)

const DURATION = 8

useGsap(() => {
  const tl = gsap.timeline({
    onUpdate() {
      elapsed.value = tl.time()
    },
    repeat: -1,
  })

  tl.to(actorRef.value, { x: 260, duration: 2, ease: 'power2.inOut' })
    .to(actorRef.value, {
      rotation: 180,
      scale: 1.4,
      duration: 2,
      ease: 'back.inOut(1.7)',
    })
    .to(actorRef.value, {
      x: 0,
      backgroundColor: '#f5a623',
      duration: 2,
      ease: 'power2.inOut',
    })
    .to(actorRef.value, {
      rotation: 360,
      scale: 1,
      backgroundColor: '#88ce02',
      duration: 2,
      ease: 'power2.inOut',
    })
})

const progress = computed(() =>
  Math.min(Math.round((elapsed.value / DURATION) * 100), 100),
)
const phase = computed(() => {
  const p = progress.value
  if (p < 25) return 'Phase 1 — sliding right'
  if (p < 50) return 'Phase 2 — rotating & scaling'
  if (p < 75) return 'Phase 3 — sliding back'
  if (p < 100) return 'Phase 4 — full spin & reset'
  return 'Complete'
})

// pageTransition: false → this page has no transition.
// willTransition evaluates to false in onBeforeRouteLeave, so
// the GSAP context is reverted immediately in onUnmounted rather
// than waiting for page:transition:finish (which would never fire).
definePageMeta({ pageTransition: false })
</script>

<template>
  <main>
    <header>
      <h1>useGsap() — No Page Transition</h1>
      <p class="hint">
        This page has <code>pageTransition: false</code>.<br>
        Click <em>← Back</em> mid-animation: the page snaps away instantly
        (no transition), then navigate back — the animation should restart
        from the beginning, confirming the context was cleanly reverted in
        <code>onUnmounted</code>.<br>
        Compare with
        <NuxtLink
          to="/use-gsap-timeline"
          class="inline-link"
        >useGsap (timeline)</NuxtLink>
        where the animation plays <em>through</em> the 1s page-fade.
      </p>
      <NuxtLink
        to="/"
        class="nav-link"
      >
        ← Back
      </NuxtLink>
    </header>

    <section class="stage">
      <div
        ref="actorRef"
        class="actor"
      />
    </section>

    <section class="progress-panel">
      <div class="track">
        <div
          class="fill"
          :style="{ width: `${progress}%` }"
        />
      </div>
      <p class="time">
        {{ elapsed.toFixed(1) }}s / {{ DURATION }}s &nbsp;({{ progress }}%)
      </p>
      <p class="phase">
        {{ phase }}
      </p>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  min-height: 100svh;
  padding: 40px 20px 80px;
  font-family: sans-serif;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

h1 {
  font-size: 1.8rem;
  margin: 0;
}

.hint {
  color: #888;
  font-size: 0.9rem;
  max-width: 520px;
  line-height: 1.6;
  margin: 0;
}

code {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 0.85em;
  color: #88ce02;
}

.inline-link {
  color: #88ce02;
  text-underline-offset: 2px;
}

.nav-link {
  display: inline-block;
  padding: 10px 24px;
  border: 1px solid #88ce02;
  border-radius: 6px;
  color: #88ce02;
  text-decoration: none;
  font-size: 0.95rem;
}

.nav-link:hover {
  background: rgba(136, 206, 2, 0.08);
}

.stage {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 600px;
  height: 140px;
  padding: 0 20px;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.actor {
  width: 80px;
  height: 80px;
  background: #88ce02;
  border-radius: 8px;
  flex-shrink: 0;
  will-change: transform, background-color;
}

.progress-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 600px;
}

.track {
  width: 100%;
  height: 8px;
  background: #222;
  border-radius: 4px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #88ce02;
  border-radius: 4px;
  transition: width 0.05s linear;
}

.time {
  color: #aaa;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  margin: 0;
}

.phase {
  color: #88ce02;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
}
</style>
