# Useful features: React, Staggers, and tooling

Primary docs:

- https://gsap.com/resources/React
- https://gsap.com/resources/getting-started/Staggers
- https://gsap.com/docs/v3/GSAP/gsap.context()
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()

## React / framework integration principles

- Scope selectors to component roots.
- Bind setup and cleanup to component lifecycle.
- Use `context` and `revert` to prevent duplicate animations in rerenders.
- Keep animation declarations near the UI they affect.

## Stagger strategy

- Use stagger to create rhythm and visual hierarchy.
- Prefer subtle stagger intervals (`0.02` to `0.12`) for UI.
- Combine with directional eases for better flow.

```ts
gsap.from('.item', {
  y: 14,
  opacity: 0,
  stagger: {
    each: 0.05,
    from: 'start',
  },
  ease: 'power2.out',
})
```

## Useful implementation tools

- `gsap.context()` for setup/teardown grouping.
- `matchMedia()` for responsive animation variants.
- `ticker` for advanced per-frame control when timelines are insufficient.

## Performance and accessibility

- Prefer reduced-motion fallbacks for non-essential motion.
- Avoid heavy stagger on very large node counts.
- Use transform and opacity for compositor-friendly rendering.
