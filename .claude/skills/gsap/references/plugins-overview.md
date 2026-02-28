# Plugins: Overview and architecture

Primary docs:

- https://gsap.com/docs/v3/Plugins
- https://gsap.com/docs/v3/Installation

## What plugins are for

- Keep GSAP core lean and load advanced capabilities only when needed.
- Examples: scroll control, dragging/inertia, SVG morphing, text splitting, physics.

## Registration model

Register once before use:

```ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)
```

Registration is idempotent; repeated calls are safe but unnecessary.

## Dependency notes (high-value)

- `ScrollSmoother` requires `ScrollTrigger`.
- `CustomWiggle` and `CustomBounce` require `CustomEase`.

## Loading strategy

- Startup registration for frequently used plugins.
- Lazy import for heavy or rarely used plugins.
- Keep plugin loading centralized to avoid duplicate initialization.

## Build tool and tree-shaking notes

- Explicit imports + `registerPlugin` avoid tree-shaking surprises.
- Avoid relying on global side effects in modular codebases.

## Recommended architecture for framework apps

- Create a dedicated animation bootstrap module.
- Expose app-level wrappers/composables around plugin APIs.
- Gate plugin usage behind capability checks where appropriate.
