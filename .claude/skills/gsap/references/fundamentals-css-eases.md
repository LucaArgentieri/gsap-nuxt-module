# Fundamentals: CSS + Eases

Primary docs:

- https://gsap.com/docs/v3/GSAP/CorePlugins/CSS
- https://gsap.com/docs/v3/Eases
- https://gsap.com/docs/v3/Eases/CustomEase

## CSS animation guidance

- Prefer transforms (`x`, `y`, `scale`, `rotation`) and `opacity` for performance.
- Use `autoAlpha` when you want opacity + visibility control.
- Prefer GSAP shorthands (`x`, `y`, `xPercent`) over manual transform strings.
- Use `clearProps` at end if styles should be reset.

## Ease families

- Power: `power1` ... `power4` (default workhorse).
- Gentle/smooth: `sine`, `circ`.
- Dramatic: `back`, `elastic`, `bounce`, `expo`.
- Linear: `none`.
- Stepped: `steps(n)` / `SteppedEase` for quantized progress.

## Ease selection heuristics

- UI transitions: `power2.out`, `power3.out`.
- Enter with subtle overshoot: `back.out(1.4)`.
- Mechanical/physical feel: `expo`, `elastic`, `bounce` with restraint.
- Data/technical visuals: `none` or low-curve `sine`.

## Custom easing

- Use `CustomEase` when product motion language needs consistency.
- Name custom eases and register once.

```ts
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)
CustomEase.create('brandEase', 'M0,0 C0.2,0 0.1,1 1,1')
```

## Pitfalls

- Overusing high-intensity eases for routine UI interactions.
- Mixing many unrelated ease types in a single interaction.
- Animating layout-heavy properties (`top/left/width/height`) when transforms would work.
