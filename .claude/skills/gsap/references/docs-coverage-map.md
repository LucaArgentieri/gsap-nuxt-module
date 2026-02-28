# GSAP Docs Coverage Map

Canonical source index: https://gsap.com/llms.txt

This file tracks how the skill maps to GSAP docs families and the major pages expected in v3 docs navigation.

## Fundamentals (docs sidebar)

- GSAP overview: https://gsap.com/docs/v3/GSAP/
- Tween: https://gsap.com/docs/v3/GSAP/Tween
- Timeline: https://gsap.com/docs/v3/GSAP/Timeline
- CSS core plugin: https://gsap.com/docs/v3/GSAP/CorePlugins/CSS
- Easing overview: https://gsap.com/docs/v3/Eases

Also covered from GSAP methods/properties family:

- `gsap.to`, `gsap.from`, `gsap.fromTo`, `gsap.set`, `gsap.timeline`
- `gsap.context`, `gsap.matchMedia`, `gsap.ticker`, `gsap.registerPlugin`
- internal core plugins: Attributes, EndArray, Modifiers, Snap

## Plugins (docs sidebar + all plugin families)

Overview:

- https://gsap.com/docs/v3/Plugins

Scroll:

- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger
- ScrollSmoother: https://gsap.com/docs/v3/Plugins/ScrollSmoother
- ScrollToPlugin: https://gsap.com/docs/v3/Plugins/ScrollToPlugin

Text:

- SplitText: https://gsap.com/docs/v3/Plugins/SplitText
- ScrambleTextPlugin: https://gsap.com/docs/v3/Plugins/ScrambleTextPlugin
- TextPlugin: https://gsap.com/docs/v3/Plugins/TextPlugin

SVG:

- DrawSVGPlugin: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin
- MorphSVGPlugin: https://gsap.com/docs/v3/Plugins/MorphSVGPlugin
- MotionPathPlugin: https://gsap.com/docs/v3/Plugins/MotionPathPlugin
- MotionPathHelper: https://gsap.com/docs/v3/Plugins/MotionPathHelper

UI:

- Flip: https://gsap.com/docs/v3/Plugins/Flip
- Draggable: https://gsap.com/docs/v3/Plugins/Draggable
- InertiaPlugin: https://gsap.com/docs/v3/Plugins/InertiaPlugin
- Observer: https://gsap.com/docs/v3/Plugins/Observer

Other:

- Physics2DPlugin: https://gsap.com/docs/v3/Plugins/Physics2DPlugin
- PhysicsPropsPlugin: https://gsap.com/docs/v3/Plugins/PhysicsPropsPlugin
- GSDevTools: https://gsap.com/docs/v3/Plugins/GSDevTools
- EaselPlugin: https://gsap.com/docs/v3/Plugins/EaselPlugin
- PixiPlugin: https://gsap.com/docs/v3/Plugins/PixiPlugin
- CSSRulePlugin: https://gsap.com/docs/v3/Plugins/CSSRulePlugin

## Useful Features & Tools (docs sidebar)

- Utility methods: https://gsap.com/docs/v3/GSAP/UtilityMethods
- Staggers: https://gsap.com/resources/getting-started/Staggers
- Helper functions: https://gsap.com/docs/v3/HelperFunctions
- React useGSAP guide: https://gsap.com/resources/React

Utility Methods checklist (all documented names):

- checkPrefix, clamp, distribute, getUnit, interpolate
- mapRange, normalize, pipe, random, selector
- shuffle, snap, splitColor, toArray, unitize
- wrap, wrapYoyo

Helper function family is covered via catalog in:

- `references/useful-helper-functions.md`

## Eases family coverage

- Eases overview: https://gsap.com/docs/v3/Eases
- CustomEase: https://gsap.com/docs/v3/Eases/CustomEase
- RoughEase: https://gsap.com/docs/v3/Eases/RoughEase
- SlowMo: https://gsap.com/docs/v3/Eases/SlowMo
- ExpoScaleEase: https://gsap.com/docs/v3/Eases/ExpoScaleEase
- CustomWiggle: https://gsap.com/docs/v3/Eases/CustomWiggle
- CustomBounce: https://gsap.com/docs/v3/Eases/CustomBounce
- SteppedEase: https://gsap.com/docs/v3/Eases/SteppedEase

## Maintenance notes

- Refresh this map when GSAP docs version changes.
- Rebuild references if plugin families or utility/helper APIs expand.
- Keep this file aligned with `SKILL.md` topic tables.
