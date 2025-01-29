function initHighlights() {
  const highlightsSection = document.querySelector('.section.highlights');
  const highlightsWrapper = document.querySelector('.highlights-wrapper');

  if (!highlightsSection || !highlightsWrapper) {
    console.warn('Highlights elements not found.');
    return;
  }

  // Uništi sve prethodne ScrollTrigger instance
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  const totalWidth = highlightsWrapper.scrollWidth - highlightsSection.offsetWidth;

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(highlightsWrapper, {
    x: -totalWidth,
    ease: "linear",
    scrollTrigger: {
      trigger: highlightsSection,
      start: "top top",
      end: `+=${totalWidth}`,
      scrub: true,
      pin: true,
    },
  });
}

initHighlights();