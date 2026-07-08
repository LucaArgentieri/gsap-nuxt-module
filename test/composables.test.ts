import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createGsapComposable } from '../src/runtime/create-gsap-composable'

vi.mock('#app', () => ({
  useNuxtApp: vi.fn(),
}))

vi.mock('#build/nuxt.config.mjs', () => ({
  appPageTransition: null,
}))

// Intercept Vue lifecycle hooks so they can be triggered manually in tests.
// This avoids needing @vue/test-utils while keeping tests isolated.
const mountedCallbacks: Array<() => void> = []
const unmountedCallbacks: Array<() => void> = []
const watchCallbacks: Array<() => void> = []
type RouteLeaveCallback = (to: unknown, from: { meta: Record<string, unknown> }) => void
const routeLeaveCallbacks: RouteLeaveCallback[] = []
const transitionFinishCallbacks: Array<() => void> = []

// Controllable current-instance mock for auto-scope specs
let currentInstance: { proxy: { $el: unknown } } | null = null

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb: () => void) => { mountedCallbacks.push(cb) }),
    onUnmounted: vi.fn((cb: () => void) => { unmountedCallbacks.push(cb) }),
    watch: vi.fn((_sources: unknown, cb: () => void) => { watchCallbacks.push(cb) }),
    getCurrentInstance: vi.fn(() => currentInstance),
  }
})

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn((cb: RouteLeaveCallback) => { routeLeaveCallbacks.push(cb) }),
}))

const mount = () => {
  mountedCallbacks.forEach(cb => cb())
}
const unmount = () => {
  unmountedCallbacks.forEach(cb => cb())
}
const triggerWatch = () => {
  watchCallbacks.forEach(cb => cb())
}
const leaveRoute = (meta: Record<string, unknown> = {}) => {
  routeLeaveCallbacks.forEach(cb => cb({}, { meta }))
}
const finishTransition = () => {
  transitionFinishCallbacks.forEach(cb => cb())
}

const mockContext = (revert = vi.fn()) => ({
  add: vi.fn((fn: () => unknown) => fn()),
  revert,
  kill: vi.fn(),
  data: [],
} as unknown as gsap.Context)

const mockNuxtAppHooks = async () => {
  const { useNuxtApp } = await import('#app')
  vi.mocked(useNuxtApp).mockReturnValue({
    hooks: {
      hookOnce: vi.fn((event: string, cb: () => void) => {
        if (event === 'page:transition:finish') {
          transitionFinishCallbacks.push(cb)
        }
        return vi.fn()
      }),
    },
  } as unknown as ReturnType<typeof useNuxtApp>)
}

const resetLifecycle = () => {
  mountedCallbacks.length = 0
  unmountedCallbacks.length = 0
  watchCallbacks.length = 0
  routeLeaveCallbacks.length = 0
  transitionFinishCallbacks.length = 0
  currentInstance = null
  vi.restoreAllMocks()
  vi.clearAllMocks()
}

describe('createGsapComposable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the plugin when it is registered in nuxtApp', async () => {
    const { useNuxtApp } = await import('#app')
    const mockPlugin = { kill: vi.fn() }
    vi.mocked(useNuxtApp).mockReturnValue({ $ScrollTrigger: mockPlugin } as unknown as ReturnType<typeof useNuxtApp>)

    const useScrollTrigger = createGsapComposable('ScrollTrigger')
    const result = useScrollTrigger()

    expect(result).toBe(mockPlugin)
  })

  it('throws with a helpful message when plugin is not registered', async () => {
    const { useNuxtApp } = await import('#app')
    vi.mocked(useNuxtApp).mockReturnValue({} as unknown as ReturnType<typeof useNuxtApp>)

    const useScrollTrigger = createGsapComposable('ScrollTrigger')

    expect(() => useScrollTrigger()).toThrow(
      '[useScrollTrigger] ScrollTrigger is not registered! Did you enable it in nuxt.config.ts?',
    )
  })

  it('returns null on the server (SSR guard)', () => {
    const useMyPlugin = createGsapComposable('MyPlugin')
    expect(() => useMyPlugin()).toThrow()
  })

  it('uses custom fallback message when provided', async () => {
    const { useNuxtApp } = await import('#app')
    vi.mocked(useNuxtApp).mockReturnValue({} as unknown as ReturnType<typeof useNuxtApp>)

    const customMessage = 'Custom error message'
    const useMyPlugin = createGsapComposable('MyPlugin', customMessage)

    expect(() => useMyPlugin()).toThrow(customMessage)
  })
})

describe('useGsap', () => {
  beforeEach(resetLifecycle)

  it('returns the gsap instance', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    expect(useGsap()).toBe(gsap)
  })

  it('returns { contextSafe } when called with a setup function', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    const result = useGsap(() => {})

    expect(result).toHaveProperty('contextSafe')
  })

  it('contextSafe is a function', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    const { contextSafe } = useGsap(() => {})

    expect(typeof contextSafe).toBe('function')
  })

  it('registers onBeforeRouteLeave for every useGsap(setup) call', async () => {
    const { onBeforeRouteLeave } = await import('vue-router')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    useGsap(() => {})

    expect(onBeforeRouteLeave).toHaveBeenCalledOnce()
  })

  it('creates the GSAP context synchronously on mount', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    useGsap(() => {})

    expect(contextSpy).not.toHaveBeenCalled()

    mount()

    expect(contextSpy).toHaveBeenCalledOnce()
  })

  it('contextSafe wraps a handler and calls through when ctx is set', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    const { contextSafe } = useGsap(() => {})
    mount()

    const handler = vi.fn().mockReturnValue('ok')
    const safeHandler = contextSafe(handler)
    safeHandler()

    expect(handler).toHaveBeenCalledOnce()
  })

  it('reverts context exactly once on unmount', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    useGsap(() => {})
    mount()

    unmount()
    unmount()

    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('does not revert anything if unmounted before mount', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    useGsap(() => {})
    unmount()

    expect(contextSpy).not.toHaveBeenCalled()
    expect(revertSpy).not.toHaveBeenCalled()
  })

  it('backward compat: useGsap() without args still returns the raw gsap instance', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    expect(useGsap()).toBe(gsap)
  })
})

describe('useGsap route-leave cleanup', () => {
  beforeEach(resetLifecycle)

  it('defers revert to page:transition:finish when the leaving page has a transition', async () => {
    await mockNuxtAppHooks()
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    useGsap(() => {})
    mount()

    leaveRoute({ pageTransition: { name: 'page' } })

    // Component unmounts (Vue flushes unmounted hooks at leave start) — the
    // revert must wait for the transition to finish
    unmount()
    expect(revertSpy).not.toHaveBeenCalled()

    finishTransition()
    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('does not double-revert on unmount after page:transition:finish already ran', async () => {
    await mockNuxtAppHooks()
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    useGsap(() => {}, { cleanupOn: 'route-leave' })
    mount()

    leaveRoute({ pageTransition: { name: 'page' } })
    unmount()
    finishTransition()
    finishTransition()

    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('reverts immediately in onUnmounted when the leaving page has no transition', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    useGsap(() => {})
    mount()

    // No pageTransition in meta and appPageTransition is null → willTransition
    // is false, so no page:transition:finish hook is registered
    leaveRoute({})
    expect(transitionFinishCallbacks).toHaveLength(0)
    expect(revertSpy).not.toHaveBeenCalled()

    unmount()
    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('reverts immediately when the page opts out with pageTransition: false', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    useGsap(() => {})
    mount()

    leaveRoute({ pageTransition: false })
    expect(transitionFinishCallbacks).toHaveLength(0)

    unmount()
    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('keeps the context alive when navigation is cancelled after the leave guard', async () => {
    await mockNuxtAppHooks()
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    useGsap(() => {})
    mount()

    // Leave guard runs, but a later guard cancels the navigation: the
    // component is never unmounted
    leaveRoute({ pageTransition: { name: 'page' } })

    // A later successful navigation elsewhere fires page:transition:finish —
    // the stale hook must NOT revert this still-mounted page's context
    finishTransition()
    expect(revertSpy).not.toHaveBeenCalled()

    // The page later unmounts without a transition → immediate revert works
    // again because the leaving state was reset
    unmount()
    expect(revertSpy).toHaveBeenCalledOnce()
  })
})

describe('useGsap options', () => {
  beforeEach(resetLifecycle)

  it('registers a watcher when dependencies option is provided', async () => {
    const { watch, ref } = await import('vue')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep })

    expect(watch).toHaveBeenCalledOnce()
  })

  it('reverts the old context and re-runs setup when dependencies change', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const firstRevertSpy = vi.fn()
    const secondRevertSpy = vi.fn()
    const contextSpy = vi.spyOn(gsap, 'context')
      .mockReturnValueOnce(mockContext(firstRevertSpy))
      .mockReturnValueOnce(mockContext(secondRevertSpy))

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep })
    mount()

    expect(contextSpy).toHaveBeenCalledTimes(1)

    triggerWatch()

    expect(firstRevertSpy).toHaveBeenCalledOnce()
    expect(contextSpy).toHaveBeenCalledTimes(2)
    expect(secondRevertSpy).not.toHaveBeenCalled()
  })

  it('does not revert or re-run setup on dependency update when revertOnUpdate is false', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const revertSpy = vi.fn()
    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext(revertSpy))

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep, revertOnUpdate: false })
    mount()
    triggerWatch()

    expect(revertSpy).not.toHaveBeenCalled()
    expect(contextSpy).toHaveBeenCalledTimes(1)
  })

  it('passes scope element to gsap.context when scope option is provided', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    const el = { nodeType: 1 } as unknown as HTMLElement
    const scopeRef = ref<HTMLElement | null>(el)
    useGsap(() => {}, { scope: scopeRef, cleanupOn: 'route-leave' })
    mount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), el)
  })
})

describe('useGsap scope resolution', () => {
  beforeEach(resetLifecycle)

  it('auto-scopes to the current component root element when no scope is passed', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    const rootEl = { nodeType: 1 } as unknown as HTMLElement
    currentInstance = { proxy: { $el: rootEl } }

    useGsap(() => {})
    mount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), rootEl)
  })

  it('falls back to global scope when there is no current instance', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    useGsap(() => {})
    mount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), undefined)
  })

  it('falls back to global scope for fragment roots ($el is a comment node)', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    currentInstance = { proxy: { $el: { nodeType: 8 } } } // comment node

    useGsap(() => {})
    mount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), undefined)
  })

  it('scope: null opts out of auto-scope (global selectors)', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    currentInstance = { proxy: { $el: { nodeType: 1 } } }

    useGsap(() => {}, { scope: null })
    mount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), undefined)
  })

  it('accepts a plain element as scope', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    const el = { nodeType: 1 } as unknown as HTMLElement
    useGsap(() => {}, { scope: el })
    mount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), el)
  })

  it('resolves a component ref scope to its root $el', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue(mockContext())

    const rootEl = { nodeType: 1 } as unknown as HTMLElement
    const componentRef = ref({ $el: rootEl })

    useGsap(() => {}, { scope: componentRef as never })
    mount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), rootEl)
  })
})
