import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  gsap: {
    plugins: ['ScrollTrigger', 'Flip'],
  },
})
