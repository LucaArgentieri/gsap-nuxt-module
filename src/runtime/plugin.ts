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

    // Validate all plugins exist before loading any
    for (const pluginName of resolvedPlugins) {
      if (!gsapPlugins[pluginName]) {
        throw new Error(
          `[gsap-nuxt-module] Plugin "${pluginName}" not found. Available plugins: ${Object.keys(gsapPlugins).join(', ')}`,
        )
      }
    }

    // Load and register all plugins in parallel
    await Promise.all(
      [...resolvedPlugins].map(async (pluginName) => {
        const plugin = await gsapPlugins[pluginName]()
        gsap.registerPlugin(plugin)
        nuxtApp.provide(pluginName, plugin)
      }),
    )
  },
})
