# Plugins: Scroll

Primary docs:

- https://gsap.com/docs/v3/Plugins/ScrollTrigger
- https://gsap.com/docs/v3/Plugins/ScrollSmoother
- https://gsap.com/docs/v3/Plugins/ScrollToPlugin

## ScrollTrigger (core scroll orchestration)

Use for:

- Triggered enter/exit animations
- Scrubbed timeline control
- Pinning and scroll-linked storytelling
- Batch reveals and responsive timeline variants

```ts
gsap.to('.panel', {
  yPercent: -20,
  scrollTrigger: {
    trigger: '.panel',
    start: 'top 80%',
    end: 'bottom top',
    scrub: true,
  },
})
```

High-value APIs:

- Instance: `refresh`, `kill`, `getVelocity`, `labelToScroll`
- Static: `create`, `batch`, `matchMedia`, `refresh`, `killAll`, `scrollerProxy`

## ScrollSmoother

- Adds smooth scrolling and effects over native scroll.
- Requires `ScrollTrigger`.
- Ensure wrapper/content structure follows docs.
- Be careful with fixed elements, nested scrolling, and accessibility.

## ScrollToPlugin

- Programmatic scroll animation for window or containers.
- Useful for nav jumps, section focus, and controlled route transitions.

```ts
gsap.to(window, { duration: 0.7, scrollTo: '#section-3', ease: 'power2.out' })
```

## Best practices

- Use `markers: true` while developing complex triggers.
- Call `ScrollTrigger.refresh()` after dynamic layout/content changes.
- Prefer `matchMedia` for breakpoint-specific scroll logic.
- Avoid overly dense trigger graphs for long pages.
