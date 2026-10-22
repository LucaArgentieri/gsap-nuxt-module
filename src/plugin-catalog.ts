export interface GSAPPluginDefinition {
  importPath: string
  exportName: string
  composable: string
  dependencies?: readonly string[]
}

/**
 * Canonical catalog for every GSAP plugin supported by the module.
 * Runtime generation, public types, documentation, and tests must derive from
 * this object so they cannot silently drift apart.
 */
export const GSAP_PLUGIN_CATALOG = {
  ScrollTrigger: { importPath: 'gsap/ScrollTrigger', exportName: 'ScrollTrigger', composable: 'useScrollTrigger' },
  ScrollToPlugin: { importPath: 'gsap/ScrollToPlugin', exportName: 'ScrollToPlugin', composable: 'useScrollToPlugin' },
  ScrollSmoother: { importPath: 'gsap/ScrollSmoother', exportName: 'ScrollSmoother', composable: 'useScrollSmoother', dependencies: ['ScrollTrigger'] },
  SplitText: { importPath: 'gsap/SplitText', exportName: 'SplitText', composable: 'useSplitText' },
  ScrambleTextPlugin: { importPath: 'gsap/ScrambleTextPlugin', exportName: 'ScrambleTextPlugin', composable: 'useScrambleTextPlugin' },
  TextPlugin: { importPath: 'gsap/TextPlugin', exportName: 'TextPlugin', composable: 'useTextPlugin' },
  DrawSVGPlugin: { importPath: 'gsap/DrawSVGPlugin', exportName: 'DrawSVGPlugin', composable: 'useDrawSVGPlugin' },
  MorphSVGPlugin: { importPath: 'gsap/MorphSVGPlugin', exportName: 'MorphSVGPlugin', composable: 'useMorphSVGPlugin' },
  MotionPathPlugin: { importPath: 'gsap/MotionPathPlugin', exportName: 'MotionPathPlugin', composable: 'useMotionPathPlugin' },
  MotionPathHelper: { importPath: 'gsap/MotionPathHelper', exportName: 'MotionPathHelper', composable: 'useMotionPathHelper' },
  Flip: { importPath: 'gsap/Flip', exportName: 'Flip', composable: 'useFlip' },
  Draggable: { importPath: 'gsap/Draggable', exportName: 'Draggable', composable: 'useDraggable' },
  InertiaPlugin: { importPath: 'gsap/InertiaPlugin', exportName: 'InertiaPlugin', composable: 'useInertiaPlugin' },
  Observer: { importPath: 'gsap/Observer', exportName: 'Observer', composable: 'useObserver' },
  PixiPlugin: { importPath: 'gsap/PixiPlugin', exportName: 'PixiPlugin', composable: 'usePixiPlugin' },
  EaselPlugin: { importPath: 'gsap/EaselPlugin', exportName: 'EaselPlugin', composable: 'useEaselPlugin' },
  Physics2DPlugin: { importPath: 'gsap/Physics2DPlugin', exportName: 'Physics2DPlugin', composable: 'usePhysics2DPlugin' },
  PhysicsPropsPlugin: { importPath: 'gsap/PhysicsPropsPlugin', exportName: 'PhysicsPropsPlugin', composable: 'usePhysicsPropsPlugin' },
  GSDevTools: { importPath: 'gsap/GSDevTools', exportName: 'GSDevTools', composable: 'useGSDevTools' },
  CustomEase: { importPath: 'gsap/CustomEase', exportName: 'CustomEase', composable: 'useCustomEase' },
  RoughEase: { importPath: 'gsap/EasePack', exportName: 'RoughEase', composable: 'useRoughEase' },
  ExpoScaleEase: { importPath: 'gsap/EasePack', exportName: 'ExpoScaleEase', composable: 'useExpoScaleEase' },
  SlowMo: { importPath: 'gsap/EasePack', exportName: 'SlowMo', composable: 'useSlowMo' },
  CustomBounce: { importPath: 'gsap/CustomBounce', exportName: 'CustomBounce', composable: 'useCustomBounce', dependencies: ['CustomEase'] },
  CustomWiggle: { importPath: 'gsap/CustomWiggle', exportName: 'CustomWiggle', composable: 'useCustomWiggle', dependencies: ['CustomEase'] },
} as const satisfies Record<string, GSAPPluginDefinition>

export type GSAPPluginName = keyof typeof GSAP_PLUGIN_CATALOG

export const GSAP_PLUGIN_NAMES = Object.freeze(Object.keys(GSAP_PLUGIN_CATALOG) as GSAPPluginName[])

const isPluginName = (name: string): name is GSAPPluginName => name in GSAP_PLUGIN_CATALOG

const editDistance = (left: string, right: string) => {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index)

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex++) {
    let previous = row[0]!
    row[0] = leftIndex
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex++) {
      const current = row[rightIndex]!
      row[rightIndex] = Math.min(
        row[rightIndex]! + 1,
        row[rightIndex - 1]! + 1,
        previous + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      )
      previous = current
    }
  }

  return row[right.length]!
}

export function resolveGSAPPlugins(requestedPlugins: readonly string[]): GSAPPluginName[] {
  const resolved = new Set<GSAPPluginName>()

  const visit = (pluginName: string) => {
    if (!isPluginName(pluginName)) {
      const suggestion = [...GSAP_PLUGIN_NAMES]
        .sort((left, right) => editDistance(pluginName, left) - editDistance(pluginName, right))[0]
      throw new Error(
        `[gsap-nuxt-module:E_PLUGIN_UNKNOWN] Unknown GSAP plugin "${pluginName}".${suggestion ? ` Did you mean "${suggestion}"?` : ''} Available plugins: ${GSAP_PLUGIN_NAMES.join(', ')}`,
      )
    }

    if (resolved.has(pluginName)) return
    const definition: GSAPPluginDefinition = GSAP_PLUGIN_CATALOG[pluginName]
    for (const dependency of definition.dependencies ?? []) visit(dependency)
    resolved.add(pluginName)
  }

  for (const pluginName of requestedPlugins) visit(pluginName)
  return [...resolved]
}

export function renderGSAPPlugin(resolvedPlugins: readonly GSAPPluginName[]): string {
  const imports = resolvedPlugins.map((pluginName) => {
    const plugin = GSAP_PLUGIN_CATALOG[pluginName]
    return `import { ${plugin.exportName} } from '${plugin.importPath}'`
  })
  const pluginNames = resolvedPlugins.map(pluginName => GSAP_PLUGIN_CATALOG[pluginName].exportName)
  const provides = resolvedPlugins.map((pluginName) => {
    const exportName = GSAP_PLUGIN_CATALOG[pluginName].exportName
    return `    nuxtApp.provide('${pluginName}', ${exportName})`
  })

  return [
    `import { defineNuxtPlugin } from '#app'`,
    `import { gsap } from 'gsap'`,
    ...imports,
    '',
    'export default defineNuxtPlugin({',
    `  name: 'gsap-nuxt-module',`,
    `  enforce: 'post',`,
    '  setup(nuxtApp) {',
    `    gsap.registerPlugin(${pluginNames.join(', ')})`,
    ...provides,
    '  },',
    '})',
    '',
  ].join('\n')
}
