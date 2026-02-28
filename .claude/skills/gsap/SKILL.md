---
name: gsap
description: Comprehensive GSAP v3 skill for fundamentals, plugins, and useful tools. Use when implementing or reviewing animations, timelines, ScrollTrigger flows, and plugin-driven motion systems.
metadata:
  author: Luca Argentieri
  version: "2026.02.18"
  source: Generated from GSAP docs index https://gsap.com/llms.txt and docs pages under https://gsap.com/docs/v3/
---

GSAP is a high-performance animation platform centered around Tweens and Timelines, with optional plugins for advanced capabilities like scroll-driven animation, text splitting, SVG morphing, drag interactions, and physics.

This skill is structured to mirror GSAP docs sections as closely as possible, with practical, implementation-focused guidance for coding agents.

> Scope baseline: GSAP v3 docs and linked resources. If GSAP docs update, refresh this skill and `references/docs-coverage-map.md`.

## Fundamentals

| Topic | Description | Reference |
|------|-------------|-----------|
| Core model | GSAP object, Tween/Timeline mental model, control surface | [fundamentals-core](references/fundamentals-core.md) |
| Tween + Timeline | Sequencing, position parameter, labels, control methods | [fundamentals-tween-timeline](references/fundamentals-tween-timeline.md) |
| CSS + Eases | Core CSS plugin, easing families, custom eases strategy | [fundamentals-css-eases](references/fundamentals-css-eases.md) |

## Plugins

| Topic | Description | Reference |
|------|-------------|-----------|
| Plugin architecture | Registration, loading, tree-shaking-safe setup, dependencies | [plugins-overview](references/plugins-overview.md) |
| Scroll plugins | ScrollTrigger, ScrollSmoother, ScrollToPlugin patterns | [plugins-scroll](references/plugins-scroll.md) |
| Text plugins | SplitText, ScrambleTextPlugin, TextPlugin workflows | [plugins-text](references/plugins-text.md) |
| SVG plugins | DrawSVG, MorphSVG, MotionPath, MotionPathHelper | [plugins-svg](references/plugins-svg.md) |
| UI plugins | Flip, Draggable, InertiaPlugin, Observer integration | [plugins-ui](references/plugins-ui.md) |
| Other + eases | Physics, GSDevTools, Easel/Pixi, CustomEase/EasePack | [plugins-other-and-eases](references/plugins-other-and-eases.md) |

## Useful Features & Tools

| Topic | Description | Reference |
|------|-------------|-----------|
| Utility methods | Full `gsap.utils` usage map and compositional patterns | [useful-utility-methods](references/useful-utility-methods.md) |
| Helper functions | Canonical GSAP helper-function catalog and practical picks | [useful-helper-functions](references/useful-helper-functions.md) |
| Staggers + React | Stagger design, useGSAP integration, app architecture tips | [useful-react-staggers-tools](references/useful-react-staggers-tools.md) |

## Agent workflow

1. Identify the animation type (basic tween, sequence, scroll-driven, morph/path, drag/physics).
2. Select the minimum plugin set needed and register plugins once.
3. Build with Timeline first for non-trivial choreography.
4. Apply responsiveness and cleanup (`matchMedia`, `context/revert`) early.
5. Add debug tooling (`markers`, GSDevTools, logging) before fine-tuning easing/timing.
6. Remove debug artifacts and verify accessibility/performance before handoff.

## Cross-cutting best practices

- Prefer timelines over many disconnected tweens.
- Keep selectors scoped; avoid accidental global target sets.
- Use `gsap.context()` / `revert()` in componentized apps to avoid leaks.
- Register plugins once at app/module startup when possible.
- Guard expensive scroll effects and heavy text splitting behind intent/viewport checks.
- Use transform/opacity whenever possible to maintain rendering performance.
- For SSR frameworks, run DOM-dependent animation code only on client lifecycle hooks.

## Coverage map

Complete mapping to GSAP docs families and high-value pages:

- [docs-coverage-map](references/docs-coverage-map.md)
