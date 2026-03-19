export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    const { toggleTransitionComplete } = usePageTransition();

    (from.meta.pageTransition as Record<string, unknown>).onLeave = (
      el: Element,
      done: () => void,
    ) => {
      const container = el.querySelector("main") ?? el;
      gsap.to(container, { autoAlpha: 0, duration: 1, ease: "power2.in", onComplete: done });
    };
    (to.meta.pageTransition as Record<string, unknown>).onEnter = (
      el: Element,
      done: () => void,
    ) => {
      const container = el.querySelector("main") ?? el;
      window.scrollTo(0, 0);
      gsap.fromTo(
        container,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            toggleTransitionComplete(true);
            done();
          },
        },
      );
    };
  }
});
