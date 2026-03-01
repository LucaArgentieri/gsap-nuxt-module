import { gsap } from 'gsap'
import { onMounted, onScopeDispose, watch } from 'vue'
import type { ComputedRef, Ref, WatchSource } from 'vue'
import { createGsapComposable } from '../create-gsap-composable'

type ContextSafeFn = <F extends (...args: unknown[]) => unknown>(fn: F) => F

export interface UseGsapOptions {
  scope?: Ref<HTMLElement | null> | ComputedRef<HTMLElement | null>
  dependencies?: WatchSource | WatchSource[]
  revertOnUpdate?: boolean
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
 * and are reverted automatically when the component unmounts (or the effect scope
 * is disposed). Pass `dependencies` to re-run `setup` reactively.
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

  onMounted(() => {
    runSetup()
  })

  if (options?.dependencies !== undefined) {
    const deps = Array.isArray(options.dependencies)
      ? options.dependencies
      : [options.dependencies]
    watch(deps, () => {
      if (options.revertOnUpdate === false) return
      ctx?.revert()
      runSetup()
    }, { flush: 'post' })
  }

  onScopeDispose(() => {
    ctx?.revert()
    ctx = null
  })

  const contextSafe: ContextSafeFn = <F extends (...args: unknown[]) => unknown>(fn: F): F => {
    return ((...args: Parameters<F>): ReturnType<F> => {
      if (ctx) {
        return ctx.add(() => fn(...args)) as ReturnType<F>
      }
      return fn(...args) as ReturnType<F>
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
export const useDraggable
  = createGsapComposable<typeof import('gsap/all').Draggable>('Draggable')
export const useFlip = createGsapComposable<typeof import('gsap/all').Flip>('Flip')
export const useObserver
  = createGsapComposable<typeof import('gsap/all').Observer>('Observer')

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
