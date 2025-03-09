// function initLenis() {
//   //Fix za random start scroll position na Work stranici <3
//   history.scrollRestoration = "manual"
//   gsap.registerPlugin(ScrollTrigger);

//   // Inicijaliziraj novu Lenis instancu
//   window.lenis = new Lenis({
//     smoothWheel: true,
//     smoothTouch: true,
//     wheelMultiplier: 1.2,
//     lerp: 0.07,
//   });

//   // Sinkroniziraj Lenis s GSAP-om
//   window.lenis.on('scroll', () => {
//     ScrollTrigger.update();
//   });

//   gsap.ticker.add((time) => {
//     window.lenis.raf(time * 1000);
//   });

//   gsap.ticker.lagSmoothing(0);

//   // Forsiraj scroll na vrh
//   window.lenis.scrollTo(0, { immediate: true });
// }

// initLenis();

function initLenis() {
  
  const lenis = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 1.2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

initLenis();