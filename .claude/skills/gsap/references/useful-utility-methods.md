# Useful features: Utility Methods

Primary docs:

- https://gsap.com/docs/v3/GSAP/UtilityMethods

Core utility methods from docs:

- `checkPrefix`
- `clamp`
- `distribute`
- `getUnit`
- `interpolate`
- `mapRange`
- `normalize`
- `pipe`
- `random`
- `selector`
- `shuffle`
- `snap`
- `splitColor`
- `toArray`
- `unitize`
- `wrap`
- `wrapYoyo`

## Pattern: function-based values

Many utilities can return functions and plug directly into tween values.

```ts
gsap.to('.dot', {
  x: gsap.utils.wrap([0, 120, 240, 360]),
  stagger: { each: 0.05 },
})
```

## Practical combinations

- `pipe(clamp(...), snap(...))` for resilient value shaping.
- `mapRange + clamp` for scroll or pointer mapping.
- `unitize(wrap(...))` when input/output values include units.
- `selector(root)` to keep DOM queries scoped.

## Safety and maintainability

- Prefer named utility pipelines for reused behavior.
- Keep randomization deterministic where testability matters.
- Avoid repeatedly allocating utility functions inside hot loops.
