/**
 * This object contains lazy-loaded GSAP plugins for use in the application.
 *
 */
import { loadDraggable, loadFlip, loadObserver } from './gsap-loaders'

export const gsapPlugins = {
  // Scroll Plugins
  ScrollTrigger: () => import('gsap/ScrollTrigger').then(mod => mod.ScrollTrigger),
  ScrollToPlugin: () => import('gsap/ScrollToPlugin').then(mod => mod.ScrollToPlugin),
  ScrollSmoother: () => import('gsap/ScrollSmoother').then(mod => mod.ScrollSmoother),

  // Text Plugins
  SplitText: () => import('gsap/SplitText').then(mod => mod.SplitText),
  ScrambleTextPlugin: () => import('gsap/ScrambleTextPlugin').then(mod => mod.ScrambleTextPlugin),
  TextPlugin: () => import('gsap/TextPlugin').then(mod => mod.TextPlugin),

  // SVG Plugins
  DrawSVGPlugin: () => import('gsap/DrawSVGPlugin').then(mod => mod.DrawSVGPlugin),
  MorphSVGPlugin: () => import('gsap/MorphSVGPlugin').then(mod => mod.MorphSVGPlugin),
  MotionPathPlugin: () => import('gsap/MotionPathPlugin').then(mod => mod.MotionPathPlugin),
  MotionPathHelper: () => import('gsap/MotionPathHelper').then(mod => mod.MotionPathHelper),

  // UI Plugins
  Flip: () => loadFlip().then(mod => mod.Flip),
  Draggable: () => loadDraggable().then(mod => mod.Draggable),
  InertiaPlugin: () => import('gsap/InertiaPlugin').then(mod => mod.InertiaPlugin),
  Observer: () => loadObserver().then(mod => mod.Observer),

  // Other Plugins
  PixiPlugin: () => import('gsap/PixiPlugin').then(mod => mod.PixiPlugin),
  EaselPlugin: () => import('gsap/EaselPlugin').then(mod => mod.EaselPlugin),
  Physics2DPlugin: () => import('gsap/Physics2DPlugin').then(mod => mod.Physics2DPlugin),
  PhysicsPropsPlugin: () => import('gsap/PhysicsPropsPlugin').then(mod => mod.PhysicsPropsPlugin),
  GSDevTools: () => import('gsap/GSDevTools').then(mod => mod.GSDevTools),

  // Eases
  CustomEase: () => import('gsap/CustomEase').then(mod => mod.CustomEase),
  RoughEase: () => import('gsap/EasePack').then(mod => mod.RoughEase),
  ExpoScaleEase: () => import('gsap/EasePack').then(mod => mod.ExpoScaleEase),
  SlowMo: () => import('gsap/EasePack').then(mod => mod.SlowMo),
  CustomBounce: () => import('gsap/CustomBounce').then(mod => mod.CustomBounce),
  CustomWiggle: () => import('gsap/CustomWiggle').then(mod => mod.CustomWiggle),
}
