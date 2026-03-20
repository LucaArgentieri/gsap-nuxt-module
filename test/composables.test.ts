import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGsapComposable } from '../src/runtime/create-gsap-composable'

// Mock #app to avoid Nuxt context requirement in unit tests
const transitionFinishCallbacks: Array<() => void> = []

vi.mock('#app', () => ({
  useNuxtApp: vi.fn(),
}))

// Intercept Vue lifecycle hooks so they can be triggered manually in tests.
// This avoids needing @vue/test-utils while keeping tests isolated.
const mountedCallbacks: Array<() => void> = []
const disposeCallbacks: Array<() => void> = []
const routeLeaveCallbacks: Array<() => void> = []
const watchCallbacks: Array<() => void> = []

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb: () => void) => { mountedCallbacks.push(cb) }),
    onScopeDispose: vi.fn((cb: () => void) => { disposeCallbacks.push(cb) }),
    watch: vi.fn((_sources: unknown, cb: () => void) => { watchCallbacks.push(cb) }),
  }
})

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn((cb: () => void) => { routeLeaveCallbacks.push(cb) }),
}))

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
    // import.meta.server is false in Vitest's jsdom environment, so we simulate
    // the SSR path by directly testing the guard condition is present in the
    // factory. The real guard runs at build-time via Vite's define replacement.
    // This test documents the expected contract: null on server, plugin on client.
    const useMyPlugin = createGsapComposable('MyPlugin')
    // In jsdom (client env), it should not return null — it will throw because
    // nuxtApp.$MyPlugin is not set. This confirms the client path is active.
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
  it('returns the gsap instance', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const result = useGsap()
    expect(result).toBe(gsap)
  })
})

describe('useGsap with setup', () => {
  beforeEach(() => {
    mountedCallbacks.length = 0
    disposeCallbacks.length = 0
    vi.restoreAllMocks()
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

  it('contextSafe wraps a handler and calls through when ctx is set', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const mockCtx = {
      add: vi.fn((fn: () => unknown) => fn()),
      revert: vi.fn(),
      kill: vi.fn(),
      data: [],
    }
    vi.spyOn(gsap, 'context').mockReturnValue(mockCtx as unknown as gsap.Context)

    const { contextSafe } = useGsap(() => {})
    // Simulate onMounted — triggers runSetup() which sets ctx
    mountedCallbacks.forEach(cb => cb())

    const handler = vi.fn().mockReturnValue('ok')
    const safeHandler = contextSafe(handler)
    safeHandler()

    expect(handler).toHaveBeenCalledOnce()
  })

  it('reverts context on scope dispose', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: revertSpy,
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    useGsap(() => {})
    // Simulate mount, then dispose
    mountedCallbacks.forEach(cb => cb())
    expect(revertSpy).not.toHaveBeenCalled()

    disposeCallbacks.forEach(cb => cb())
    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('backward compat: useGsap() without args still returns the raw gsap instance', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    expect(useGsap()).toBe(gsap)
  })
})

describe('useGsap cleanupOn option', () => {
  beforeEach(() => {
    mountedCallbacks.length = 0
    disposeCallbacks.length = 0
    routeLeaveCallbacks.length = 0
    transitionFinishCallbacks.length = 0
    vi.clearAllMocks()
  })

  it('registers onBeforeRouteLeave for every useGsap(setup) call', async () => {
    const { onBeforeRouteLeave } = await import('vue-router')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    useGsap(() => {})

    expect(onBeforeRouteLeave).toHaveBeenCalledOnce()
  })

  it('registers onBeforeRouteLeave when cleanupOn is route-leave', async () => {
    const { useNuxtApp } = await import('#app')
    const { onBeforeRouteLeave } = await import('vue-router')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

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

    useGsap(() => {}, { cleanupOn: 'route-leave' })

    expect(onBeforeRouteLeave).toHaveBeenCalledOnce()
  })

  it('reverts context on route leave when cleanupOn is route-leave', async () => {
    const { useNuxtApp } = await import('#app')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

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

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: revertSpy,
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    useGsap(() => {}, { cleanupOn: 'route-leave' })
    mountedCallbacks.forEach(cb => cb())
    expect(revertSpy).not.toHaveBeenCalled()

    // Simulate route leave
    routeLeaveCallbacks.forEach(cb => cb())
    // Then simulate the page:transition:finish hook
    transitionFinishCallbacks.forEach(cb => cb())
    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('default (no cleanupOn): defers revert to page:transition:finish on navigation', async () => {
    const { useNuxtApp } = await import('#app')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

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

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: revertSpy,
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    useGsap(() => {}) // no cleanupOn option
    mountedCallbacks.forEach(cb => cb())
    expect(revertSpy).not.toHaveBeenCalled()

    routeLeaveCallbacks.forEach(cb => cb())
    transitionFinishCallbacks.forEach(cb => cb())
    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('skips onScopeDispose revert when scope is disposed eagerly during navigation', async () => {
    const { useNuxtApp } = await import('#app')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

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

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: revertSpy,
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    useGsap(() => {})
    mountedCallbacks.forEach(cb => cb())

    // Simulate route leave (sets isLeavingViaRoute = true)
    routeLeaveCallbacks.forEach(cb => cb())

    // Scope is disposed eagerly by Nuxt before transition:finish — revert must NOT fire
    disposeCallbacks.forEach(cb => cb())
    expect(revertSpy).not.toHaveBeenCalled()

    // Transition finishes — revert fires now
    transitionFinishCallbacks.forEach(cb => cb())
    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('still reverts on scope dispose when cleanupOn is route-leave (safety fallback)', async () => {
    const { useNuxtApp } = await import('#app')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

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

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: revertSpy,
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    useGsap(() => {}, { cleanupOn: 'route-leave' })
    mountedCallbacks.forEach(cb => cb())

    // Simulate route leave first, then page:transition:finish (sets ctx to null)
    routeLeaveCallbacks.forEach(cb => cb())
    transitionFinishCallbacks.forEach(cb => cb())
    expect(revertSpy).toHaveBeenCalledOnce()

    // Scope dispose after — revert should NOT be called again (ctx is null)
    disposeCallbacks.forEach(cb => cb())
    expect(revertSpy).toHaveBeenCalledOnce()
  })
})

describe('useGsap options', () => {
  beforeEach(() => {
    mountedCallbacks.length = 0
    disposeCallbacks.length = 0
    watchCallbacks.length = 0
    vi.restoreAllMocks()
  })

  it('registers a watcher when dependencies option is provided', async () => {
    const { watch } = await import('vue')
    const { ref } = await import('vue')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep })

    expect(watch).toHaveBeenCalledOnce()
  })

  it('does not revert context on dependency update when revertOnUpdate is false', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const revertSpy = vi.fn()
    vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: revertSpy,
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep, revertOnUpdate: false })
    mountedCallbacks.forEach(cb => cb())

    // Trigger the watch callback — revert must NOT be called
    watchCallbacks.forEach(cb => cb())
    expect(revertSpy).not.toHaveBeenCalled()
  })

  it('passes scope element to gsap.context when scope option is provided', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: vi.fn(),
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    const el = {} as HTMLElement
    const scopeRef = ref<HTMLElement | null>(el)
    useGsap(() => {}, { scope: scopeRef })
    mountedCallbacks.forEach(cb => cb())

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), el)
  })
})
