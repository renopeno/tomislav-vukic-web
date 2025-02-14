function getScrollPosition() {
  return {
    scrollY: window.scrollY || window.pageYOffset,
    documentHeight: Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    ),
    viewportHeight: window.innerHeight,
    bodyTop: document.body.getBoundingClientRect().top
  };
}

function logScrollPosition(message) {
  const pos = getScrollPosition();
  console.log(`🛹 ${message}:
    - window.scrollY: ${pos.scrollY}px
    - body.top: ${pos.bodyTop}px
    - document height: ${pos.documentHeight}px
    - viewport height: ${pos.viewportHeight}px
    - lenis instance exists: ${!!window.lenis}
  `);
}

// Prvo resetiraj scroll
logScrollPosition('Before initial scroll reset');
document.body.classList.add('loading');
window.scrollTo(0, 0);
logScrollPosition('After initial scroll reset');

function initLenis() {
  logScrollPosition('Starting Lenis initialization');
  gsap.registerPlugin(ScrollTrigger);

  // Uništi postojeću instancu ako postoji
  if (window.lenis) {
    logScrollPosition('Before destroying existing Lenis');
    window.lenis.destroy();
    logScrollPosition('After destroying existing Lenis');
  }

  // Inicijaliziraj novu Lenis instancu
  window.lenis = new Lenis({
    smoothWheel: true,
    wheelMultiplier: 1,
    lerp: 0.1,
  });
  logScrollPosition('After new Lenis instance creation');

  // Sinkroniziraj Lenis s GSAP-om
  window.lenis.on('scroll', () => {
    ScrollTrigger.update();
    logScrollPosition('Lenis scroll event');
  });

  gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Forsiraj scroll na vrh
  logScrollPosition('Before forcing scroll to top');
  window.lenis.scrollTo(0, { immediate: true });
  logScrollPosition('After forcing scroll to top');
}

// Čekaj da se DOM učita
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    logScrollPosition('DOMContentLoaded triggered');
    initLenis();
  });
} else {
  logScrollPosition('Immediate Lenis init');
  initLenis();
}