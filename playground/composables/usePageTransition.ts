export const usePageTransition = () => {
  const transitionState = reactive({
    transitionComplete: false,
  })

  const toggleTransitionComplete = (value: boolean) => {
    transitionState.transitionComplete = value
  }

  return {
    transitionState,
    toggleTransitionComplete,
  }
}

/*
const { transitionState } = usePageTransition();

Detect if transition is completed
watch(() => transitionState.transitionComplete, (newValue) => {
  if (newValue) {
   //...Gsap animation
  }
})
*/
