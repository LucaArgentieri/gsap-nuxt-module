import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
