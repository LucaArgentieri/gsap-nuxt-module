export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  runtimeConfig: {
    gsap: process.env.NUXT_GSAP_TOKEN,
  },
  compatibilityDate: '2025-02-26',
  gsap: {
    plugins: ['Draggable', 'EaselPlugin', 'Flip', 'MotionPathPlugin', 'Observer', 'PixiPlugin', 'ScrollToPlugin', 'ScrollTrigger', 'TextPlugin', 'RoughEase', 'ExpoScaleEase', 'SlowMo', 'CustomEase', 'InertiaPlugin', 'ScrollSmoother', 'GSDevTools', 'MotionPathHelper', 'SplitText', 'ScrambleTextPlugin', 'Physics2DPlugin', 'PhysicsPropsPlugin', 'CustomWiggle', 'CustomBounce'],
  },
})
