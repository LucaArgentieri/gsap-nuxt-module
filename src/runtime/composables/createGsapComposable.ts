import { createGsapComposable } from '../create-gsap-composable'

// Scroll Plugins
export const useScrollTrigger = createGsapComposable<typeof import('gsap/ScrollTrigger').ScrollTrigger>('ScrollTrigger')
export const useScrollSmoother = createGsapComposable<typeof import('gsap/ScrollSmoother').ScrollSmoother>('ScrollSmoother')

// Text Plugins
export const useSplitText = createGsapComposable<typeof import('gsap/SplitText').SplitText>('SplitText')

// SVG Plugins
export const useMotionPathHelper = createGsapComposable<typeof import('gsap/MotionPathHelper').MotionPathHelper>('MotionPathHelper')

// UI Plugins
export const useDraggable = createGsapComposable<typeof import('gsap/Draggable').Draggable>('Draggable')
export const useFlip = createGsapComposable<typeof import('gsap/Flip').Flip>('Flip')
export const useObserver = createGsapComposable<typeof import('gsap/Observer').Observer>('Observer')

// Other Plugins
export const useGSDevTools = createGsapComposable<typeof import('gsap/GSDevTools').GSDevTools>('GSDevTools')

// Eases
export const useCustomEase = createGsapComposable<typeof import('gsap/CustomEase').CustomEase>('CustomEase')
export const useCustomWiggle = createGsapComposable<typeof import('gsap/CustomWiggle').CustomWiggle>('CustomWiggle')
export const useCustomBounce = createGsapComposable<typeof import('gsap/CustomBounce').CustomBounce>('CustomBounce')
