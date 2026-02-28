# Plugins: Text

Primary docs:

- https://gsap.com/docs/v3/Plugins/SplitText
- https://gsap.com/docs/v3/Plugins/ScrambleTextPlugin
- https://gsap.com/docs/v3/Plugins/TextPlugin

## SplitText

Use for character/word/line-level reveals and typographic choreography.

Common flow:

1. Split content (`chars/words/lines`).
2. Animate split units.
3. Revert after transition if structure should return to semantic baseline.

```ts
const split = SplitText.create('.headline', { type: 'lines,words,chars' })
gsap.from(split.chars, { yPercent: 110, stagger: 0.01, duration: 0.6 })
```

## ScrambleTextPlugin

- Great for status labels, code-like transitions, terminal effects.
- Keep durations short for readability.

## TextPlugin

- Tween text replacement for counters, labels, copy transitions.
- Pair with accessibility checks for screen reader implications.

## Best practices

- Keep source text semantic before/after animation.
- Avoid very large DOM splits for performance-sensitive views.
- Re-split on resize only when line wrapping changes are relevant.
