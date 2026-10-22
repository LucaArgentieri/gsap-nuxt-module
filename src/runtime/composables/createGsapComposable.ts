import { useNuxtApp, useRoute, useRouter } from '#app'
import { appPageTransitionEnabled } from '#build/gsap-nuxt-module/config.mjs'
import { gsap } from 'gsap'
import type { WatchSource } from 'vue'
import { getCurrentInstance, onMounted, onUnmounted, watch } from 'vue'
import { createGsapComposable } from '../create-gsap-composable'
import type { GsapScope } from '../utils/element'
import { unrefElement } from '../utils/element'

/**
 * Wraps an event handler so it runs inside the active GSAP context.
 *
 * **Note:** return values are discarded when a context exists — `ctx.add()`
 * returns `void`. Use `contextSafe` only for void side-effect handlers
 * (DOM events, pointer callbacks, etc.).
 */
type ContextSafeFn = <F extends (...args: unknown[]) => void>(fn: F) => F

export interface UseGsapOptions {
  /**
   * Element the GSAP context's CSS selectors are scoped to. Accepts a plain
   * element, a template ref, or a component ref (its root `$el` is used).
   *
   * Defaults to the current component's root element, so selectors never leak
   * to same-class elements in other components. Pass `scope: null` to opt out
   * and match selectors globally.
   */
  scope?: GsapScope
  dependencies?: WatchSource | WatchSource[]
  /**
   * Revert existing contexts before a dependency-driven setup rerun. When
   * false, contexts accumulate intentionally and are all reverted on unmount.
   * @default true
   */
  revertOnUpdate?: boolean
  /**
   * When to revert the GSAP context during page navigation.
   *
   * @deprecated This option has no behavioral effect. Both `'unmount'` and
   * `'route-leave'` produce identical behavior: when the leaving page has a
   * transition defined (per-page `definePageMeta({ pageTransition })` or a
   * global `app.pageTransition` in `nuxt.config`), the GSAP context revert is
   * deferred to Nuxt's `page:transition:finish` hook; otherwise it happens
   * immediately in `onUnmounted`. Kept for backward compatibility only.
   *
   * @example
   * // Continuous animation that plays through the page-leave transition
   * useGsap(() => { ... }, { cleanupOn: 'route-leave' })
   */
  cleanupOn?: 'unmount' | 'route-leave'
}

/**
 * Zero-argument overload — returns the raw GSAP instance.
 *
 * Use it to call `gsap.timeline()`, `gsap.to()`, `gsap.set()`,
 * utility methods (`gsap.utils`, `gsap.ticker`), and more.
 *
 * **Cleanup is the caller's responsibility.**
 *
 * @see https://gsap.com/docs/v3/GSAP/
 */
export function useGsap(): typeof gsap

/**
 * Setup-function overload — wraps `gsap.context()` with automatic revert.
 *
 * Animations declared inside `setup` are scoped to the `scope` element — by
 * default the current component's root element (pass `scope: null` for a
 * global, unscoped context) — and are reverted automatically on teardown.
 * When the current route has a
 * transition, the revert is deferred to Nuxt's `page:transition:finish` hook so
 * animations play through the fade-out; otherwise it reverts immediately.
 * Pass `dependencies` to re-run `setup` reactively.
 *
 * Returns `{ contextSafe }` — a wrapper for event handlers that need to add
 * animations to the existing context after mount.
 *
 * @see https://gsap.com/docs/v3/GSAP/gsap.context()
 */
export function useGsap(
  setup: (ctx: gsap.Context) => void,
  options?: UseGsapOptions,
): { contextSafe: ContextSafeFn }

export function useGsap(
  setup?: (ctx: gsap.Context) => void,
  options?: UseGsapOptions,
): typeof gsap | { contextSafe: ContextSafeFn } {
  if (!setup) return gsap

  // SSR guard — GSAP is DOM-only; return a no-op contextSafe on the server
  if (import.meta.server) {
    return { contextSafe: fn => fn }
  }

  let ctx: gsap.Context | null = null
  const contexts: gsap.Context[] = []
  const stopCleanupHooks: Array<() => void> = []
  let transitionRunning = false
  let pendingUnmount = false

  // Captured at call time: `scope` defaults to the calling component's root
  // element so selectors stay contained without explicit wiring.
  const instance = getCurrentInstance()
  // `useRoute()` works in any component, unlike `onBeforeRouteLeave()` which
  // requires the caller to be a descendant of `<router-view>` — useGsap must
  // support components outside it too (layouts, shared UI, etc.).
  const route = useRoute()
  // Capture the owning route. By unmount time `useRoute()` may already expose
  // the destination route, whose transition settings do not describe the
  // component that is leaving.
  const pageTransition = route.meta.pageTransition
  const willTransition = pageTransition !== false
    && !!(pageTransition ?? appPageTransitionEnabled)
  const nuxtApp = useNuxtApp()

  const runSetup = () => {
    const scope = options?.scope !== undefined
      ? unrefElement(options.scope)
      : unrefElement(instance?.proxy)
    ctx = gsap.context(setup, scope)
    contexts.push(ctx)
  }

  const revertContexts = () => {
    for (const context of contexts.splice(0).reverse()) context.revert()
    ctx = null
  }

  const dispose = () => {
    pendingUnmount = false
    for (const stop of stopCleanupHooks.splice(0)) stop()
    revertContexts()
  }

  if (willTransition) {
    const router = useRouter()
    // Subscribe before navigation begins. Depending on Vue's transition timing,
    // page:transition:finish may run just before or just after onUnmounted.
    stopCleanupHooks.push(
      nuxtApp.hooks.hook('page:start', () => {
        if (pendingUnmount) {
          dispose()
          return
        }
        transitionRunning = true
      }),
      nuxtApp.hooks.hook('page:transition:finish', () => {
        transitionRunning = false
        if (pendingUnmount) dispose()
      }),
      router.afterEach((_to, _from, failure) => {
        if (failure) transitionRunning = false
      }),
    )
  }

  onMounted(() => {
    runSetup()
  })

  if (options?.dependencies !== undefined) {
    const deps = Array.isArray(options.dependencies)
      ? options.dependencies
      : [options.dependencies]
    watch(
      deps,
      () => {
        if (options.revertOnUpdate !== false) revertContexts()
        runSetup()
      },
      { flush: 'post' },
    )
  }

  onUnmounted(() => {
    pendingUnmount = willTransition && transitionRunning
    if (!pendingUnmount) dispose()
  })

  const contextSafe: ContextSafeFn = <F extends (...args: unknown[]) => void>(fn: F): F => {
    return ((...args: Parameters<F>): void => {
      if (ctx) {
        ctx.add(() => fn(...args))
      }
      else {
        fn(...args)
      }
    }) as F
  }

  return { contextSafe }
}

// Scroll Plugins
export const useScrollTrigger
  = createGsapComposable<typeof import('gsap/ScrollTrigger').ScrollTrigger>('ScrollTrigger')
export const useScrollToPlugin
  = createGsapComposable<typeof import('gsap/ScrollToPlugin').ScrollToPlugin>('ScrollToPlugin')
export const useScrollSmoother
  = createGsapComposable<typeof import('gsap/ScrollSmoother').ScrollSmoother>('ScrollSmoother')

// Text Plugins
export const useSplitText
  = createGsapComposable<typeof import('gsap/SplitText').SplitText>('SplitText')
export const useScrambleTextPlugin
  = createGsapComposable<typeof import('gsap/ScrambleTextPlugin').ScrambleTextPlugin>('ScrambleTextPlugin')
export const useTextPlugin
  = createGsapComposable<typeof import('gsap/TextPlugin').TextPlugin>('TextPlugin')

// SVG Plugins
export const useDrawSVGPlugin
  = createGsapComposable<typeof import('gsap/DrawSVGPlugin').DrawSVGPlugin>('DrawSVGPlugin')
export const useMorphSVGPlugin
  = createGsapComposable<typeof import('gsap/MorphSVGPlugin').MorphSVGPlugin>('MorphSVGPlugin')
export const useMotionPathPlugin
  = createGsapComposable<typeof import('gsap/MotionPathPlugin').MotionPathPlugin>('MotionPathPlugin')
export const useMotionPathHelper
  = createGsapComposable<typeof import('gsap/MotionPathHelper').MotionPathHelper>('MotionPathHelper')

// UI Plugins
export const useDraggable = createGsapComposable<typeof import('gsap/Draggable').Draggable>('Draggable')
export const useFlip = createGsapComposable<typeof import('gsap/Flip').Flip>('Flip')
export const useInertiaPlugin
  = createGsapComposable<typeof import('gsap/InertiaPlugin').InertiaPlugin>('InertiaPlugin')
export const useObserver = createGsapComposable<typeof import('gsap/Observer').Observer>('Observer')

// Other Plugins
export const usePixiPlugin
  = createGsapComposable<typeof import('gsap/PixiPlugin').PixiPlugin>('PixiPlugin')
export const useEaselPlugin
  = createGsapComposable<typeof import('gsap/EaselPlugin').EaselPlugin>('EaselPlugin')
export const usePhysics2DPlugin
  = createGsapComposable<typeof import('gsap/Physics2DPlugin').Physics2DPlugin>('Physics2DPlugin')
export const usePhysicsPropsPlugin
  = createGsapComposable<typeof import('gsap/PhysicsPropsPlugin').PhysicsPropsPlugin>('PhysicsPropsPlugin')
export const useGSDevTools
  = createGsapComposable<typeof import('gsap/GSDevTools').GSDevTools>('GSDevTools')

// Eases
export const useCustomEase
  = createGsapComposable<typeof import('gsap/CustomEase').CustomEase>('CustomEase')
export const useRoughEase
  = createGsapComposable<typeof import('gsap/EasePack').RoughEase>('RoughEase')
export const useExpoScaleEase
  = createGsapComposable<typeof import('gsap/EasePack').ExpoScaleEase>('ExpoScaleEase')
export const useSlowMo
  = createGsapComposable<typeof import('gsap/EasePack').SlowMo>('SlowMo')
export const useCustomWiggle
  = createGsapComposable<typeof import('gsap/CustomWiggle').CustomWiggle>('CustomWiggle')
export const useCustomBounce
  = createGsapComposable<typeof import('gsap/CustomBounce').CustomBounce>('CustomBounce')
