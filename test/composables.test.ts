import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createGsapComposable } from '../src/runtime/create-gsap-composable'

vi.mock('#app', () => ({
  useNuxtApp: vi.fn(),
}))

const mountedCallbacks: Array<() => void | Promise<void>> = []
const unmountedCallbacks: Array<() => void> = []
const watchCallbacks: Array<() => void | Promise<void>> = []
const nextTickMock = vi.fn(() => Promise.resolve())

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    nextTick: nextTickMock,
    onMounted: vi.fn((cb: () => void | Promise<void>) => { mountedCallbacks.push(cb) }),
    onUnmounted: vi.fn((cb: () => void) => { unmountedCallbacks.push(cb) }),
    watch: vi.fn((_sources: unknown, cb: () => void | Promise<void>) => { watchCallbacks.push(cb) }),
  }
})

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
}))

const flushMount = async () => {
  await Promise.all(mountedCallbacks.map(cb => cb()))
}

const flushWatch = async () => {
  await Promise.all(watchCallbacks.map(cb => cb()))
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
  beforeEach(() => {
    mountedCallbacks.length = 0
    unmountedCallbacks.length = 0
    watchCallbacks.length = 0
    nextTickMock.mockClear()
    vi.restoreAllMocks()
  })

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

  it('does not register onBeforeRouteLeave', async () => {
    const { onBeforeRouteLeave } = await import('vue-router')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    useGsap(() => {})

    expect(onBeforeRouteLeave).not.toHaveBeenCalled()
  })

  it('creates the GSAP context only after nextTick on mount', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: vi.fn(),
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    useGsap(() => {})

    expect(contextSpy).not.toHaveBeenCalled()

    await flushMount()

    expect(nextTickMock).toHaveBeenCalledOnce()
    expect(contextSpy).toHaveBeenCalledOnce()
  })

  it('contextSafe wraps a handler and calls through when ctx is set', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: vi.fn(),
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    const { contextSafe } = useGsap(() => {})
    await flushMount()

    const handler = vi.fn().mockReturnValue('ok')
    const safeHandler = contextSafe(handler)
    safeHandler()

    expect(handler).toHaveBeenCalledOnce()
  })

  it('reverts context exactly once on unmount', async () => {
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
    await flushMount()

    unmountedCallbacks.forEach(cb => cb())
    unmountedCallbacks.forEach(cb => cb())

    expect(revertSpy).toHaveBeenCalledOnce()
  })

  it('does not create a context if unmounted before nextTick resolves', async () => {
    nextTickMock.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          queueMicrotask(resolve)
        }),
    )

    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: vi.fn(),
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    useGsap(() => {})

    const pendingMount = Promise.all(mountedCallbacks.map(cb => cb()))
    unmountedCallbacks.forEach(cb => cb())
    await pendingMount

    expect(contextSpy).not.toHaveBeenCalled()
  })

  it('backward compat: useGsap() without args still returns the raw gsap instance', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')

    expect(useGsap()).toBe(gsap)
  })
})

describe('useGsap options', () => {
  beforeEach(() => {
    mountedCallbacks.length = 0
    unmountedCallbacks.length = 0
    watchCallbacks.length = 0
    nextTickMock.mockClear()
    vi.restoreAllMocks()
  })

  it('registers a watcher when dependencies option is provided', async () => {
    const { watch, ref } = await import('vue')
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep })

    expect(watch).toHaveBeenCalledOnce()
  })

  it('re-runs setup after nextTick when dependencies change', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const firstRevertSpy = vi.fn()
    const secondRevertSpy = vi.fn()
    const contextSpy = vi.spyOn(gsap, 'context')
      .mockReturnValueOnce({
        add: vi.fn((fn: () => unknown) => fn()),
        revert: firstRevertSpy,
        kill: vi.fn(),
        data: [],
      } as unknown as gsap.Context)
      .mockReturnValueOnce({
        add: vi.fn((fn: () => unknown) => fn()),
        revert: secondRevertSpy,
        kill: vi.fn(),
        data: [],
      } as unknown as gsap.Context)

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep })
    await flushMount()

    expect(contextSpy).toHaveBeenCalledTimes(1)

    await flushWatch()

    expect(firstRevertSpy).toHaveBeenCalledOnce()
    expect(nextTickMock).toHaveBeenCalledTimes(2)
    expect(contextSpy).toHaveBeenCalledTimes(2)
    expect(secondRevertSpy).not.toHaveBeenCalled()
  })

  it('does not revert or re-run setup on dependency update when revertOnUpdate is false', async () => {
    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const revertSpy = vi.fn()
    const contextSpy = vi.spyOn(gsap, 'context').mockReturnValue({
      add: vi.fn((fn: () => unknown) => fn()),
      revert: revertSpy,
      kill: vi.fn(),
      data: [],
    } as unknown as gsap.Context)

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep, revertOnUpdate: false })
    await flushMount()
    await flushWatch()

    expect(revertSpy).not.toHaveBeenCalled()
    expect(contextSpy).toHaveBeenCalledTimes(1)
  })

  it('deduplicates rapid dependency updates and keeps only the latest scheduled setup', async () => {
    nextTickMock.mockImplementation(() => Promise.resolve())

    const { useGsap } = await import('../src/runtime/composables/createGsapComposable')
    const { gsap } = await import('gsap')
    const { ref } = await import('vue')

    const firstRevertSpy = vi.fn()
    const secondRevertSpy = vi.fn()
    const contextSpy = vi.spyOn(gsap, 'context')
      .mockReturnValueOnce({
        add: vi.fn((fn: () => unknown) => fn()),
        revert: firstRevertSpy,
        kill: vi.fn(),
        data: [],
      } as unknown as gsap.Context)
      .mockReturnValueOnce({
        add: vi.fn((fn: () => unknown) => fn()),
        revert: secondRevertSpy,
        kill: vi.fn(),
        data: [],
      } as unknown as gsap.Context)

    const dep = ref(0)
    useGsap(() => {}, { dependencies: dep })
    await flushMount()

    const watchCallback = watchCallbacks[0]!
    const firstUpdate = watchCallback()
    const secondUpdate = watchCallback()
    await Promise.all([firstUpdate, secondUpdate])

    expect(firstRevertSpy).toHaveBeenCalledOnce()
    expect(contextSpy).toHaveBeenCalledTimes(2)
    expect(secondRevertSpy).not.toHaveBeenCalled()
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
    useGsap(() => {}, { scope: scopeRef, cleanupOn: 'route-leave' })
    await flushMount()

    expect(contextSpy).toHaveBeenCalledWith(expect.any(Function), el)
  })
})
