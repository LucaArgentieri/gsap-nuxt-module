<script setup lang="ts">
definePageMeta({ pageTransition })
</script>

<template>
  <main>
    <header>
      <h1>useGsap() — Auto-scope</h1>
      <p class="hint">
        Both cards animate a generic <code>.box</code> selector via
        <code>useGsap(setup)</code> <em>without</em> passing <code>scope</code>.
        The context auto-scopes to each component's root element, so one card
        bounces and the other spins — the selectors never leak across
        components. Pass <code>scope: null</code> to opt into global selectors.
      </p>
      <NuxtLink
        to="/"
        class="nav-link"
      >
        ← Back
      </NuxtLink>
    </header>

    <div class="cards">
      <AutoScopeCard
        title="Card A — bounce"
        animation="bounce"
      />
      <AutoScopeCard
        title="Card B — spin"
        animation="spin"
      />
    </div>
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

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 700px;
}
</style>
