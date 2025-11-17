function initLenis() {
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    smoothWheel: true,
    smoothTouch: false,
    infinite: false
  });

  // Globalna instance za pristup iz drugih fileova
  window.lenis = lenis;

  // Integracija ScrollTrigger-a s Lenis-om za smooth horizontal scroll
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.body.style.transform ? "transform" : "fixed"
  });

  // Integracija sa GSAP ticker-om za bolje performanse
  lenis.on('scroll', ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);
}

window.initLenis = initLenis;
initLenis();