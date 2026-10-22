import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  GSAP_PLUGIN_CATALOG,
  GSAP_PLUGIN_NAMES,
  renderGSAPPlugin,
  resolveGSAPPlugins,
} from '../src/plugin-catalog'

describe('GSAP plugin catalog', () => {
  it('defines a unique composable for every supported plugin', () => {
    const composables = Object.values(GSAP_PLUGIN_CATALOG).map(plugin => plugin.composable)

    expect(GSAP_PLUGIN_NAMES).toHaveLength(25)
    expect(new Set(composables)).toHaveLength(GSAP_PLUGIN_NAMES.length)
  })

  it('resolves dependencies before the requested plugin and removes duplicates', () => {
    expect(resolveGSAPPlugins(['ScrollSmoother', 'ScrollTrigger', 'CustomBounce'])).toEqual([
      'ScrollTrigger',
      'ScrollSmoother',
      'CustomEase',
      'CustomBounce',
    ])
  })

  it('reports unknown plugins with a useful suggestion', () => {
    expect(() => resolveGSAPPlugins(['ScrollTriggr'])).toThrow(
      '[gsap-nuxt-module:E_PLUGIN_UNKNOWN] Unknown GSAP plugin "ScrollTriggr". Did you mean "ScrollTrigger"?',
    )
  })

  it('renders only selected plugins and their resolved dependencies', () => {
    const source = renderGSAPPlugin(resolveGSAPPlugins(['CustomWiggle']))

    expect(source).toContain(`from 'gsap/CustomEase'`)
    expect(source).toContain(`from 'gsap/CustomWiggle'`)
    expect(source).not.toContain('ScrollTrigger')
    expect(source.indexOf('gsap.registerPlugin(CustomEase, CustomWiggle)')).toBeGreaterThan(-1)
  })

  it('keeps public composables and documentation aligned with the catalog', () => {
    const runtime = readFileSync(fileURLToPath(new URL('../src/runtime/composables/createGsapComposable.ts', import.meta.url)), 'utf8')
    const readme = readFileSync(fileURLToPath(new URL('../README.md', import.meta.url)), 'utf8')
    const reference = readFileSync(fileURLToPath(new URL('../docs/content/2.composables/3.plugins-reference.md', import.meta.url)), 'utf8')

    for (const plugin of Object.values(GSAP_PLUGIN_CATALOG)) {
      expect(runtime).toContain(`export const ${plugin.composable}`)
      expect(readme).toContain(`\`${plugin.composable}()\``)
      expect(reference).toContain(`\`${plugin.composable}()\``)
    }
  })
})
