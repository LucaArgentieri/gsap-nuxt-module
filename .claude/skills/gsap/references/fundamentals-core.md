# Fundamentals: Core

Primary docs:

- https://gsap.com/docs/v3/GSAP/
- https://gsap.com/docs/v3/Installation

## Mental model

- `gsap` is the entry point API.
- `Tween` animates properties over time.
- `Timeline` composes tweens and nested timelines.
- Core plugin support (CSS/Attributes/EndArray/etc.) is available without extra plugin files.

## Core methods you should reach for first

- `gsap.to()` for end-state animation.
- `gsap.from()` for animate-in patterns.
- `gsap.fromTo()` for explicit state transitions.
- `gsap.set()` for immediate state setup.
- `gsap.timeline()` for orchestration.

## Control and lifecycle methods

- Lifecycle/state: `isTweening`, `getTweensOf`, `killTweensOf`, `getById`.
- Scheduling: `delayedCall`.
- Defaults/config: `defaults`, `config`.
- Plugin/ease registration: `registerPlugin`, `registerEffect`, `registerEase`.
- Responsiveness: `matchMedia`, `matchMediaRefresh`.
- Context cleanup: `context`, `revert`.
- Performance helpers: `quickSetter`, `quickTo`, `ticker`.

## Practical defaults strategy

```ts
import { gsap } from 'gsap'

gsap.defaults({
  duration: 0.6,
  ease: 'power2.out',
})
```

Keep defaults conservative and override only where necessary.

## SSR/framework-safe baseline

- Create animations in client-only lifecycle blocks.
- Scope selectors to component roots.
- Clean up on unmount with `context().revert()`.

```ts
const ctx = gsap.context(() => {
  gsap.from('.item', { y: 24, opacity: 0, stagger: 0.06 })
}, rootEl)

// teardown
ctx.revert()
```

## Common mistakes

- Animating before layout is ready.
- Recreating identical tweens in repeated renders.
- Mixing timeline-based and standalone tweens for the same target without a plan.
- Forgetting cleanup in componentized architectures.
