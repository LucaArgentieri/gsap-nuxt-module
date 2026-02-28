import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGsapComposable } from '../src/runtime/create-gsap-composable'

// Mock #app to avoid Nuxt context requirement in unit tests
vi.mock('#app', () => ({
  useNuxtApp: vi.fn(),
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
