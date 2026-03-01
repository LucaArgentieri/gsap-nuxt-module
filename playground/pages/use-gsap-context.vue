<script setup lang="ts">
// ─── Section 1: auto-cleanup ─────────────────────────────────────────────────
// useGsap(setup) — animations are reverted automatically when navigating away.
const gsap = useGsap()
const loopBoxRef = ref<HTMLDivElement | null>(null)

useGsap(() => {
  gsap.to(loopBoxRef.value, {
    x: 200,
    duration: 1,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
  })
})

// ─── Section 2: scoped selector ──────────────────────────────────────────────
// useGsap(setup, { scope }) — `.box` resolves only within the container.
const containerRef = ref<HTMLDivElement | null>(null)

useGsap(
  () => {
    gsap.to('.scoped-box', {
      rotation: 360,
      duration: 2,
      ease: 'none',
      repeat: -1,
    })
  },
  { scope: containerRef },
)

// ─── Section 3: contextSafe event handler ────────────────────────────────────
// contextSafe wraps click handlers so they are added to the existing context.
const clickBoxRef = ref<HTMLDivElement | null>(null)
const clickCount = ref(0)

const { contextSafe } = useGsap(() => {
  gsap.set(clickBoxRef.value, { scale: 1 })
})

const handleClick = contextSafe(() => {
  clickCount.value++
  gsap.to(clickBoxRef.value, {
    scale: 1.4,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    ease: 'power1.inOut',
    overwrite: true,
  })
})
</script>

<template>
  <main>
    <h1>useGsap() — context API</h1>
    <p>Modelled on <code>@gsap/react</code>'s <code>useGSAP</code>.</p>

    <!-- Section 1 -->
    <section>
      <h2>1. Auto-cleanup</h2>
      <p class="hint">
        The looping tween is reverted automatically when you navigate away — no manual
        <code>onUnmounted</code> needed.
      </p>
      <div class="stage">
        <div
          ref="loopBoxRef"
          class="box green"
        />
      </div>
    </section>

    <!-- Section 2 -->
    <section>
      <h2>2. Scoped selector</h2>
      <p class="hint">
        <code>{ scope: containerRef }</code> — the <code>.scoped-box</code>
        selector resolves only inside the marked container.
      </p>
      <div class="stage">
        <!-- This .scoped-box is OUTSIDE the scope — should not rotate -->
        <div class="scoped-box box orange outside-label">
          outside scope
        </div>
        <div
          ref="containerRef"
          class="scope-container"
        >
          <!-- This .scoped-box is INSIDE the scope — should rotate -->
          <div class="scoped-box box orange">
            inside scope
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3 -->
    <section>
      <h2>3. contextSafe event handler</h2>
      <p class="hint">
        Click the box — the handler is wrapped with <code>contextSafe</code> so it runs inside the
        existing GSAP context.
      </p>
      <div class="stage">
        <button
          class="reset-btn"
          @click="handleClick"
        >
          Click me ({{ clickCount }})
        </button>
        <div
          ref="clickBoxRef"
          class="box purple"
        />
      </div>
    </section>

    <NuxtLink to="/"> ← Back </NuxtLink>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  min-height: 100svh;
  padding: 40px 20px 80px;
  font-family: sans-serif;
  overscroll-behavior: none;
}

h1 {
  font-size: 2rem;
  margin: 0;
}

h2 {
  font-size: 1.2rem;
  margin: 0 0 8px;
}

p {
  color: #888;
  margin: 0;
}

p.hint {
  font-size: 0.85rem;
  text-align: center;
  max-width: 460px;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  width: 100%;
  min-height: 120px;
}

.box {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.green {
  background: #88ce02;
}

.orange {
  background: #f5a623;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #000;
  font-weight: bold;
  text-align: center;
}

.purple {
  background: #9b59b6;
}

.outside-label {
  opacity: 0.4;
}

.scope-container {
  border: 2px dashed #88ce02;
  padding: 20px;
  border-radius: 8px;
}

.reset-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #9b59b6;
  border-radius: 6px;
  color: #9b59b6;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.reset-btn:hover {
  background: rgba(155, 89, 182, 0.1);
}

a {
  color: #88ce02;
  text-decoration: none;
  font-size: 0.9rem;
}
</style>
