import { createPage, setup } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

describe('page-transition lifecycle in a real browser', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/with-transitions', import.meta.url)),
    browser: true,
    browserOptions: { type: 'chromium' },
  })

  it('keeps GSAP alive through leave and restarts it on return', async () => {
    const page = await createPage('/')

    await page.waitForSelector('.box')
    await page.waitForFunction(() => Boolean(document.querySelector<HTMLElement>('.box')?.style.transform))

    await page.getByRole('link', { name: 'Go to other page' }).click({ noWaitAfter: true })
    await page.waitForTimeout(100)

    const leavingTransform = await page.locator('.box').evaluate(element => (element as HTMLElement).style.transform)
    expect(leavingTransform).not.toBe('')
    expect(await page.locator('.shared-animation').count()).toBe(1)

    await page.waitForSelector('.other-page')
    expect(await page.locator('.box').count()).toBe(0)

    await page.getByRole('link', { name: 'Go back' }).click()
    await page.waitForSelector('.box')
    await page.waitForFunction(() => Boolean(document.querySelector<HTMLElement>('.box')?.style.transform))
  })

  it('cleans up immediately when the leaving page disables transitions', async () => {
    const page = await createPage('/no-transition')

    await page.waitForFunction(() => Boolean(document.querySelector<HTMLElement>('.no-transition-box')?.style.transform))
    await page.getByRole('link', { name: 'Go to other page' }).click()
    await page.waitForSelector('.other-page')

    const revertedTransform = await page.evaluate(() => {
      return (window as Window & { __noTransitionBox?: HTMLElement }).__noTransitionBox?.style.transform
    })
    expect(revertedTransform).toBe('')
  })

  it('keeps the active context when navigation is cancelled', async () => {
    const page = await createPage('/')

    await page.waitForFunction(() => Boolean(document.querySelector<HTMLElement>('.box')?.style.transform))
    await page.evaluate(async () => {
      const router = (window as Window & { __testRouter?: { push: (path: string) => Promise<unknown> } }).__testRouter
      await router?.push('/cancelled').catch(() => {})
    })

    await page.waitForTimeout(100)
    expect(page.url()).not.toContain('/cancelled')
    expect(await page.locator('.box').count()).toBe(1)
    expect(await page.locator('.box').evaluate(element => (element as HTMLElement).style.transform)).not.toBe('')
  })

  it('cleans the leaving context through redirects and rapid navigation', async () => {
    const page = await createPage('/')

    await page.waitForFunction(() => Boolean(document.querySelector<HTMLElement>('.box')?.style.transform))
    await page.evaluate(() => {
      const router = (window as Window & { __testRouter?: { push: (path: string) => Promise<unknown> } }).__testRouter
      if (!router) throw new Error('Test router was not exposed')
      void router.push('/redirect')
      window.setTimeout(() => void router.push('/no-transition'), 25)
    })

    await page.waitForSelector('.other-page, .no-transition-page')
    await page.waitForTimeout(500)
    const revertedTransform = await page.evaluate(() => {
      return (window as Window & { __transitionBox?: HTMLElement }).__transitionBox?.style.transform
    })
    expect(revertedTransform).toBe('')
  }, 10_000)
})
