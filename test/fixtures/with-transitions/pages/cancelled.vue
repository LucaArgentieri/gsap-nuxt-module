<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="cancelled-page">
    This route must never render.
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'cancel' })
</script>
