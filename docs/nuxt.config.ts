export default defineNuxtConfig({
  extends: ["docus"],
  css: ["~/assets/css/main.css"],
  robots: {
    robotsTxt: false,
  },
  // https://docus.dev/en/ai/llms
  llms: {
    domain: "https://lucaargentieri.github.io/gsap-nuxt-module/",
  },
});
