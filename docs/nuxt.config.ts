export default defineNuxtConfig({
  extends: ['docus'],
  css: ['~/assets/css/main.css'],
  // https://docus.dev/en/ai/llms
  llms: {
    domain: 'https://lucaargentieri.github.io/gsap-nuxt-module/',
  },
  robots: {
    robotsTxt: false,
  },
})
