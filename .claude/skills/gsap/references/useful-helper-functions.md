# Useful features: Helper Functions

Primary docs:

- https://gsap.com/docs/v3/HelperFunctions

GSAP provides a catalog of helper recipes for recurring advanced tasks.

High-value helpers listed in docs include:

- `addWeightedEases`
- `alignOrigins`
- `anchorsToProgress`
- `bgSize`
- `blendEases`
- `callAfterResize`
- `compensatedSkew`
- `easeToLinear`
- `FLIP` helper
- `formatNumber`
- `getDirectionalSnapFunc`
- `getNestedLabelTime`
- `getScrollLookup`
- `getScrollPosition`
- `imageSequenceScrub`
- `killChildTweensOf`
- `LottieScrollTrigger`
- `nestedLinesSplit`
- `pluckRandomFrom`
- `progressiveBuild`
- `seamlessLoop`
- `smoothOriginChange`
- `stopOverscroll`
- `tickGSAPWhileHidden`
- `trackDirection`
- `weightedRandom`

## How agents should use helpers

- Treat helpers as reference implementations, not mandatory dependencies.
- Inline and adapt only what is needed for the feature.
- Preserve credits/attribution where source snippets require it.
- Validate browser/device behavior for scroll and touch helpers.

## Best candidates for product code

- `seamlessLoop` for carousels/marquees.
- `callAfterResize` for debounced refresh.
- `getDirectionalSnapFunc` for gesture snapping UX.
- `LottieScrollTrigger` for hybrid media storytelling.
