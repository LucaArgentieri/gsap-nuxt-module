import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  // @ts-expect-error - types generated after dev:prepare
  gsap: {
    plugins: ['ScrollTrigger', 'Flip'],
  },
})
