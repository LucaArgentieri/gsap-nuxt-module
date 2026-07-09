import { useNuxtApp, useRoute } from '#app'
import { appPageTransition as defaultPageTransition } from '#build/nuxt.config.mjs'
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

  // Captured at call time: `scope` defaults to the calling component's root
  // element so selectors stay contained without explicit wiring.
  const instance = getCurrentInstance()
  // `useRoute()` works in any component, unlike `onBeforeRouteLeave()` which
  // requires the caller to be a descendant of `<router-view>` — useGsap must
  // support components outside it too (layouts, shared UI, etc.).
  const route = useRoute()
  const nuxtApp = useNuxtApp()

  const runSetup = () => {
    const scope = options?.scope !== undefined
      ? unrefElement(options.scope)
      : unrefElement(instance?.proxy)
    ctx = gsap.context(setup, scope)
  }

  const clearContext = () => {
    ctx?.revert()
    ctx = null
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
        if (options.revertOnUpdate === false) return
        clearContext()
        runSetup()
      },
      { flush: 'post' },
    )
  }

  onUnmounted(() => {
    const willTransition = route.meta.pageTransition !== false
      && !!(route.meta.pageTransition ?? defaultPageTransition)

    if (willTransition) {
      nuxtApp.hooks.hookOnce('page:transition:finish', () => {
        clearContext()
      })
    }
    else {
      clearContext()
    }
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
export const useScrollSmoother
  = createGsapComposable<typeof import('gsap/ScrollSmoother').ScrollSmoother>('ScrollSmoother')

// Text Plugins
export const useSplitText
  = createGsapComposable<typeof import('gsap/SplitText').SplitText>('SplitText')

// SVG Plugins
export const useMotionPathHelper
  = createGsapComposable<typeof import('gsap/MotionPathHelper').MotionPathHelper>('MotionPathHelper')

// UI Plugins
export const useDraggable = createGsapComposable<typeof import('gsap/all').Draggable>('Draggable')
export const useFlip = createGsapComposable<typeof import('gsap/all').Flip>('Flip')
export const useObserver = createGsapComposable<typeof import('gsap/all').Observer>('Observer')

// Other Plugins
export const useGSDevTools
  = createGsapComposable<typeof import('gsap/GSDevTools').GSDevTools>('GSDevTools')

// Eases
export const useCustomEase
  = createGsapComposable<typeof import('gsap/CustomEase').CustomEase>('CustomEase')
export const useCustomWiggle
  = createGsapComposable<typeof import('gsap/CustomWiggle').CustomWiggle>('CustomWiggle')
export const useCustomBounce
  = createGsapComposable<typeof import('gsap/CustomBounce').CustomBounce>('CustomBounce')
