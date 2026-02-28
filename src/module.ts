import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import type { gsapPlugins } from './runtime/gsap-plugins'

export type GSAPPluginName = keyof typeof gsapPlugins

export interface ModuleOptions {
  plugins?: GSAPPluginName[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gsap-nuxt-module',
    configKey: 'gsap',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    plugins: [],
  },
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    _nuxt.options.runtimeConfig.public.gsap = {
      plugins: _options.plugins ?? [],
    }

    addPlugin({ src: resolve('./runtime/plugin'), mode: 'client' })
    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(resolve('./runtime/utils'))
  },
})
