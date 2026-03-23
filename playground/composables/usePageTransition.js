const transitionState = reactive({
  transitionComplete: false,
})

export const usePageTransition = () => {
  const toggleTransitionComplete = (value) => {
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
