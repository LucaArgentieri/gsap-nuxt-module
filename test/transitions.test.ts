import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

describe('with-transitions fixture', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/with-transitions', import.meta.url)),
  })

  it('renders the index page with gsap-page class', async () => {
    const html = await $fetch('/')
    expect(html).toContain('gsap-page')
  })

  it('renders the other page', async () => {
    const html = await $fetch('/other')
    expect(html).toContain('other-page')
  })
})
