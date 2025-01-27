function initLenis() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 0.65,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smooth: true,
    smoothTouch: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.ticker.add((time) => lenis.raf(time));
  lenis.on('scroll', ScrollTrigger.update);
}

initLenis();