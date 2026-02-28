import { useNuxtApp } from '#app'

/**
 * Factory that creates a composable returning a registered GSAP plugin.
 *
 * The returned composable reads the plugin from `nuxtApp` at call time.
 * Returns `null` during SSR (plugin is client-only).
 * Throws on the client if the plugin was not enabled in `nuxt.config.ts`.
 *
 * **Cleanup is the caller's responsibility.**
 * Destroy instances created from the plugin (e.g. `Draggable`, `ScrollTrigger`)
 * in `onUnmounted` to avoid memory leaks.
 *
 * @param pluginName - Name of the GSAP plugin as registered in nuxtApp.
 * @param fallbackMessage - Optional custom error message for missing plugin.
 */
export function createGsapComposable<T>(
  pluginName: string,
  fallbackMessage?: string,
): () => T | null {
  return () => {
    if (import.meta.server) return null
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
