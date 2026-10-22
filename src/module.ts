import { addImportsDir, addPluginTemplate, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { renderGSAPPlugin, resolveGSAPPlugins } from './plugin-catalog'
import type { GSAPPluginName } from './plugin-catalog'

export type { GSAPPluginName } from './plugin-catalog'

export interface ModuleOptions {
  /**
   * GSAP plugins to register on the client. Dependencies are added
   * automatically and plugins not listed here are excluded from the bundle.
   * @default []
   */
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
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const plugins = resolveGSAPPlugins(options.plugins ?? [])

    addTemplate({
      filename: 'gsap-nuxt-module/config.mjs',
      getContents: () => `export const appPageTransitionEnabled = ${JSON.stringify(nuxt.options.app.pageTransition !== false && Boolean(nuxt.options.app.pageTransition))}\n`,
    })

    if (plugins.length > 0) {
      addPluginTemplate({
        filename: 'gsap-nuxt-module/plugin.client.mjs',
        mode: 'client',
        getContents: () => renderGSAPPlugin(plugins),
      })
    }
    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(resolve('./runtime/utils'))
  },
})
