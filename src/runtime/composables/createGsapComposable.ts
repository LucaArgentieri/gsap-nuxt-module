import { gsap } from 'gsap'
import type { ComputedRef, Ref, WatchSource } from 'vue'
import { onMounted, onUnmounted, watch } from 'vue'
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
   * @deprecated This option is ignored and kept only for backward compatibility.
   * Cleanup always happens in `onUnmounted`. For pages this is already
   * transition-aware: Nuxt unmounts the leaving page only after its leave
   * transition finishes, so animations play through the fade-out either way.
   *
   * @example
   * // `cleanupOn` is ignored, but still accepted for compatibility
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
 * and are reverted automatically in `onUnmounted`. For a leaving page, Nuxt
 * fires `onUnmounted` only after the leave transition finishes, so animations
 * play through the fade-out before cleanup runs. Pass `dependencies` to re-run
 * `setup` reactively.
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

  const runSetup = () => {
    const scope = options?.scope?.value ?? undefined
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

  // No route hooks needed: Nuxt's page wrapper flushes a leaving page's
  // `unmounted` hooks only after the leave transition completes (measured on
  // Nuxt 4 / Vue 3.5: `onUnmounted` fires together with
  // `page:transition:finish`), so this revert never interrupts a transition.
  // Note this deferral is a Nuxt page behavior — `onScopeDispose` or a bare
  // Vue `<Transition>` around a component would tear down at leave *start*.
  onUnmounted(() => {
    clearContext()
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
