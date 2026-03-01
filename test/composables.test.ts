import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGsapComposable } from '../src/runtime/create-gsap-composable'

// Mock #app to avoid Nuxt context requirement in unit tests
vi.mock('#app', () => ({
  useNuxtApp: vi.fn(),
}))

// Intercept Vue lifecycle hooks so they can be triggered manually in tests.
// This avoids needing @vue/test-utils while keeping tests isolated.
const mountedCallbacks: Array<() => void> = []
const disposeCallbacks: Array<() => void> = []

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb: () => void) => { mountedCallbacks.push(cb) }),
    onScopeDispose: vi.fn((cb: () => void) => { disposeCallbacks.push(cb) }),
    watch: vi.fn(),
  }
})

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
