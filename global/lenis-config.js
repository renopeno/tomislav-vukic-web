function initLenis() {
  //Fix za random start scroll position na Work stranici <3
  history.scrollRestoration = "manual"
  gsap.registerPlugin(ScrollTrigger);

  // Uništi postojeću instancu ako postoji
  if (window.lenis) {
    window.lenis.destroy();
  }

  // Inicijaliziraj novu Lenis instancu
  window.lenis = new Lenis({
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.2,
    touchMultiplier: 2,
    touchInertiaMultiplier: 2.5,
    lerp: 0.07,
  });

  // Sinkroniziraj Lenis s GSAP-om
  window.lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Forsiraj scroll na vrh
  window.lenis.scrollTo(0, { immediate: true });
}

// Čekaj da se DOM učita
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLenis);
} else {
  initLenis();
}