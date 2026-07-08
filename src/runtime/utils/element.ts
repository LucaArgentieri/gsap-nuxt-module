import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue'
import { unref } from 'vue'

export type GsapScopeTarget = HTMLElement | SVGElement | ComponentPublicInstance | null | undefined
export type GsapScope = GsapScopeTarget | Ref<GsapScopeTarget> | ComputedRef<GsapScopeTarget>

/**
 * Minimal `unrefElement`: unwraps refs and resolves component instances to
 * their root `$el`. Returns `undefined` for fragment roots (`$el` is a
 * Comment/Text node) so GSAP falls back to an unscoped context instead of
 * receiving a non-Element. Duck-types via `nodeType` rather than
 * `instanceof Element` so it stays environment-agnostic (no DOM globals
 * required at import time).
 */
export function unrefElement(target: GsapScope): Element | undefined {
  const plain = unref(target)
  const el = (plain as ComponentPublicInstance)?.$el ?? plain
  return (el as Element)?.nodeType === 1 ? el as Element : undefined
}
