import { fileURLToPath } from 'node:url'
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
    const resolver = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    _nuxt.options.runtimeConfig.public.gsap = {
      plugins: _options.plugins ?? [],
    }

    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve(runtimeDir, 'composables'))
    addImportsDir(resolver.resolve(runtimeDir, 'utils'))
  },
})
