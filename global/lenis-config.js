function initLenis() {
  gsap.registerPlugin(ScrollTrigger);

  // Uništi postojeću instancu ako postoji
  if (window.lenis) {
    window.lenis.destroy();
  }

  // Inicijaliziraj novu Lenis instancu
  window.lenis = new Lenis({
    smoothWheel: true,
    wheelMultiplier: 1,
    lerp: 0.3,
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