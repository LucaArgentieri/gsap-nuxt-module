<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="redirect-page">
    Redirecting…
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'redirect' })
</script>
