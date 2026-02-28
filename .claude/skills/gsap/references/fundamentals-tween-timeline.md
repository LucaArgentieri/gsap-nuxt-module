# Fundamentals: Tween + Timeline

Primary docs:

- https://gsap.com/docs/v3/GSAP/Tween
- https://gsap.com/docs/v3/GSAP/Timeline
- https://gsap.com/resources/position-parameter

## Tween essentials

- A tween is a high-performance property setter over time.
- Use vars for duration/ease/repeat/yoyo/callbacks.
- Reuse tween instances when you need runtime control (`pause`, `resume`, `progress`).

## Timeline essentials

- A timeline is a container that coordinates child animation playheads.
- Nest timelines for modular choreography.
- Prefer timeline composition for multi-step flows.

```ts
const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

tl.from('.title', { y: 24, opacity: 0 })
  .from('.subtitle', { y: 18, opacity: 0 }, '-=0.35')
  .from('.cta', { scale: 0.9, opacity: 0 }, '+=0.1')
```

## Position parameter quick rules

- Absolute seconds: `1.2`
- Relative offsets: `'+=0.3'`, `'-=0.2'`
- Labels for semantic anchoring: `'intro'`, `'intro+=0.2'`

## Labels and navigation

```ts
tl.addLabel('intro', 0)
tl.addLabel('focus', 1.4)
tl.seek('focus')
```

Use labels when animation timing must remain maintainable during iteration.

## Common control methods

- Playback: `play`, `pause`, `resume`, `restart`, `reverse`
- Time/progress: `time`, `totalTime`, `progress`, `totalProgress`
- Tempo: `timeScale`
- Cleanup: `kill`, `revert`

## Best practices

- Keep one timeline per interaction/section where possible.
- Use timeline defaults to avoid repetitive vars.
- Prefer small semantic timelines over one giant global timeline.
- Use `eventCallback` for explicit hooks instead of ad-hoc timers.
