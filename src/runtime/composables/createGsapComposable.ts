import { useNuxtApp } from '#app'
import { appPageTransition as defaultPageTransition } from '#build/nuxt.config.mjs'
import { gsap } from 'gsap'
import type { ComputedRef, Ref, WatchSource } from 'vue'
import { onMounted, onUnmounted, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { createGsapComposable } from '../create-gsap-composable'

/**
 * Wraps an event handler so it runs inside the active GSAP context.
 *
 * **Note:** return values are discarded when a context exists — `ctx.add()`
 * returns `void`. Use `contextSafe` only for void side-effect handlers
 * (DOM events, pointer callbacks, etc.).
 */
type ContextSafeFn = <F extends (...args: unknown[]) => void>(fn: F) => F

export interface UseGsapOptions {
  scope?: Ref<HTMLElement | null> | ComputedRef<HTMLElement | null>
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
 * Animations declared inside `setup` are scoped to the optional `scope` element
 * and are reverted automatically on teardown. When the leaving page has a
 * transition, the revert is deferred to Nuxt's `page:transition:finish` hook so
 * animations play through the fade-out; otherwise it runs in `onUnmounted`.
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
  let isLeavingViaRoute = false
  let isUnmounted = false

  const runSetup = () => {
    const scope = options?.scope?.value ?? undefined
    ctx = gsap.context(setup, scope)
  }

  const clearContext = () => {
    ctx?.revert()
    ctx = null
  }

  // `onUnmounted` alone is NOT transition-safe: Vue flushes `unmounted` hooks
  // at leave *start* (vuejs/core#994); any "fires with page:transition:finish"
  // timing is an emergent artifact of NuxtPage's Suspense + `out-in` mode and
  // isn't guaranteed. When the leaving page has a transition we defer the
  // revert explicitly via Nuxt's documented `page:transition:finish` hook.
  onBeforeRouteLeave((_to, from) => {
    const willTransition = from.meta.pageTransition !== false
      && !!(from.meta.pageTransition ?? defaultPageTransition)

    if (willTransition) {
      isLeavingViaRoute = true
      const nuxtApp = useNuxtApp()
      nuxtApp.hooks.hookOnce('page:transition:finish', () => {
        // A later guard may have cancelled the navigation: the component is
        // still mounted and its context must stay alive, so only revert once
        // the unmount actually happened.
        if (isUnmounted) {
          clearContext()
        }
        else {
          isLeavingViaRoute = false
        }
      })
    }
  })

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
    isUnmounted = true
    // No transition pending (non-route unmount, or `pageTransition: false`):
    // revert immediately. Otherwise the `page:transition:finish` hook above
    // owns the revert.
    if (!isLeavingViaRoute) {
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
