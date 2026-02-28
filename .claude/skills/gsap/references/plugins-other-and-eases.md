# Plugins: Other + Eases

Primary docs:

- https://gsap.com/docs/v3/Plugins/Physics2DPlugin
- https://gsap.com/docs/v3/Plugins/PhysicsPropsPlugin
- https://gsap.com/docs/v3/Plugins/GSDevTools
- https://gsap.com/docs/v3/Plugins/EaselPlugin
- https://gsap.com/docs/v3/Plugins/PixiPlugin
- https://gsap.com/docs/v3/Eases/CustomEase
- https://gsap.com/docs/v3/Eases/RoughEase
- https://gsap.com/docs/v3/Eases/SlowMo
- https://gsap.com/docs/v3/Eases/ExpoScaleEase
- https://gsap.com/docs/v3/Eases/CustomWiggle
- https://gsap.com/docs/v3/Eases/CustomBounce

## Physics plugins

- `Physics2DPlugin`: velocity/angle/friction style motion.
- `PhysicsPropsPlugin`: independent per-property physics.
- Use for playful trajectories and motion systems where simple eases feel artificial.

## GSDevTools

- Timeline scrubbing and debugging UI.
- Use in development and advanced QA; typically not for end users.

## Canvas ecosystem plugins

- `EaselPlugin` for EaselJS integration.
- `PixiPlugin` for PixiJS integration (`registerPIXI` where applicable).

## Advanced eases

- `CustomEase`: brand motion curves.
- `RoughEase`: controlled randomness.
- `SlowMo`: slow-in-the-middle style effects.
- `ExpoScaleEase`: exponential scale transitions.
- `CustomWiggle` and `CustomBounce` (require `CustomEase`).

## Best practices

- Keep custom ease names semantic (`brand.inOut`, `cta.spring`).
- Avoid overusing rough/bounce effects in productivity interfaces.
- Profile heavy physics animations on low-powered devices.
