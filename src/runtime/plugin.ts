import { gsap } from 'gsap'
import { gsapPlugins } from './gsap-plugins'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin({
  name: 'gsap-nuxt-module',
  enforce: 'post',
  setup: async (nuxtApp) => {
    const config = useRuntimeConfig().public.gsap as { plugins: string[] }
    const pluginsToRegister = new Set(config.plugins || []) as Set<keyof typeof gsapPlugins>

    const pluginDependencies: Partial<Record<keyof typeof gsapPlugins, (keyof typeof gsapPlugins)[]>> = {
      ScrollSmoother: ['ScrollTrigger'],
      CustomWiggle: ['CustomEase'],
      CustomBounce: ['CustomEase'],
    }

    const resolvedPlugins = new Set<keyof typeof gsapPlugins>()
    const resolvePlugin = (plugin: keyof typeof gsapPlugins) => {
      if (resolvedPlugins.has(plugin)) return
      const deps = pluginDependencies[plugin] || []
      deps.forEach(resolvePlugin)
      resolvedPlugins.add(plugin)
    }

    for (const plugin of pluginsToRegister) {
      resolvePlugin(plugin)
    }

    // Load and register all plugins
    for (const pluginName of resolvedPlugins) {
      const loader = gsapPlugins[pluginName]
      if (!loader) {
        throw new Error(
          `[gsap-nuxt-module] Plugin "${pluginName}" not found. Available plugins: ${Object.keys(gsapPlugins).join(', ')}`,
        )
      }

      try {
        const plugin = await loader()
        gsap.registerPlugin(plugin)
        nuxtApp.provide(pluginName, plugin)
      }
      catch (err) {
        console.error(`[gsap-nuxt-module] Failed to load plugin "${pluginName}":`, err)
      }
    }
  },
})
