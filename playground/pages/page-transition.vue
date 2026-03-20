<script setup lang="ts">
const gsap = useGsap();
const containerA = ref<HTMLDivElement | null>(null);
const containerB = ref<HTMLDivElement | null>(null);

useGsap(
  () => {
    gsap.to(".box-a", {
      y: -40,
      duration: 0.6,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.15,
    });
  },
  { scope: containerA, cleanupOn: "route-leave" },
);

useGsap(
  () => {
    gsap.to(".box-b", {
      y: -40,
      duration: 0.6,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.15,
    });
  },
  { scope: containerB },
);

definePageMeta({
  pageTransition: pageTransition,
});
</script>

<template>
  <div class="page-container">
    <header>
      <h1>Page Transition + Cleanup Strategies</h1>
      <p>Navigate away to see both cleanup strategies in action during the page transition.</p>
    </header>

    <div class="columns">
      <section ref="containerA" class="column">
        <h2>cleanupOn: 'route-leave'</h2>
        <p>
          Reverts via <code>onScopeDispose</code> after the leave transition finishes — boxes keep
          bouncing <strong>through</strong> the fade-out, then stop when the component unmounts.
        </p>
        <div class="boxes">
          <div class="box box-a" />
          <div class="box box-a" />
          <div class="box box-a" />
        </div>
      </section>

      <section ref="containerB" class="column">
        <h2>cleanupOn: 'unmount' (default)</h2>
        <p>
          Reverts via <code>onScopeDispose</code> — boxes keep bouncing <strong>through</strong> the
          fade-out, then stop when the component unmounts.
        </p>
        <div class="boxes">
          <div class="box box-b" />
          <div class="box box-b" />
          <div class="box box-b" />
        </div>
      </section>
    </div>

    <footer>
      <NuxtLink to="/">← Back</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding: 40px;
  font-family: sans-serif;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

header h1 {
  font-size: 1.8rem;
  margin-bottom: 12px;
}

header p {
  color: #666;
  font-size: 1rem;
}

.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  flex: 1;
  margin-bottom: 40px;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.column h2 {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.column p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 30px;
  text-align: center;
  line-height: 1.5;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.85em;
}

.boxes {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex: 1;
  align-items: flex-end;
}

.box {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  will-change: transform;
}

.box-a {
  background: linear-gradient(135deg, #88ce02, #a8ee2f);
  box-shadow: 0 4px 12px rgba(136, 206, 2, 0.3);
}

.box-b {
  background: linear-gradient(135deg, #0066ff, #3399ff);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

footer {
  text-align: center;
}

a {
  display: inline-block;
  padding: 10px 20px;
  color: #88ce02;
  text-decoration: none;
  border: 1px solid #88ce02;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.95rem;
}

a:hover {
  background: #88ce02;
  color: #000;
}
</style>
