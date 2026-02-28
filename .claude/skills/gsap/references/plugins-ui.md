# Plugins: UI interactions

Primary docs:

- https://gsap.com/docs/v3/Plugins/Flip
- https://gsap.com/docs/v3/Plugins/Draggable
- https://gsap.com/docs/v3/Plugins/InertiaPlugin
- https://gsap.com/docs/v3/Plugins/Observer

## Flip

- First-Last-Invert-Play transitions for layout changes.
- Great for list reorders, card expansion, route/UI state transitions.

Typical flow:

1. `Flip.getState(targets)`
2. mutate DOM/layout
3. `Flip.from(state, vars)`

## Draggable

- Pointer/mouse/touch dragging with bounds and momentum support.
- Pair with InertiaPlugin for natural throw physics.

## InertiaPlugin

- Velocity-based continuation after drag/release.
- Useful for kinetic UI controls and constrained momentum.

## Observer

- Unified gesture/scroll/wheel/touch observation.
- Useful for intent detection and low-level interaction orchestration.

## Best practices

- Apply constraints (bounds, axes) to prevent chaotic UX.
- Decouple animation state from business state when possible.
- Clean up listeners/instances on teardown.
