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

window.initLenis = initLenis;
initLenis();