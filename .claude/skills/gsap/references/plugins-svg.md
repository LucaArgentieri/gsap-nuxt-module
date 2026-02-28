# Plugins: SVG

Primary docs:

- https://gsap.com/docs/v3/Plugins/DrawSVGPlugin
- https://gsap.com/docs/v3/Plugins/MorphSVGPlugin
- https://gsap.com/docs/v3/Plugins/MotionPathPlugin
- https://gsap.com/docs/v3/Plugins/MotionPathHelper

## DrawSVGPlugin

- Reveals/hides strokes by animating draw ranges.
- Use for signatures, diagrams, path-based illustrations.

## MorphSVGPlugin

- Morphs one SVG shape into another.
- Ensure compatible path geometry for stable results.
- Preprocess with `convertToPath` when needed.

## MotionPathPlugin

- Animate targets along SVG/custom paths.
- Useful for guided motion, orbital paths, charts/diagram storytelling.

```ts
gsap.to('.dot', {
  duration: 2,
  repeat: -1,
  ease: 'none',
  motionPath: {
    path: '#orbitPath',
    align: '#orbitPath',
    autoRotate: true,
  },
})
```

## MotionPathHelper

- Interactive path editing helper for authoring/tuning.
- Keep out of production bundles unless intentionally needed.

## Best practices

- Use optimized SVGs and simplify paths where possible.
- Normalize transform origins for reliable alignment.
- Validate in multiple viewport sizes and DPRs.
