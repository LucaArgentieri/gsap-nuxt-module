import { useNuxtApp } from '#app'

/**
 * Factory to create GSAP plugin composables.
 * @param pluginName - Name of the GSAP plugin as provided in nuxtApp injects.
 * @param fallbackMessage - Optional error message for missing plugin.
 */
export function createGsapComposable<T>(
  pluginName: string,
  fallbackMessage?: string,
): () => T {
  return () => {
    const nuxtApp = useNuxtApp()
    const plugin = nuxtApp[`$${pluginName}`] as T | undefined
    if (!plugin) {
      throw new Error(
        fallbackMessage || `[use${pluginName}] ${pluginName} is not registered! Did you enable it in nuxt.config.ts?`,
      )
    }
    return plugin
  }
}
