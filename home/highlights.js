function initHomeHighlights() {
  const highlightsSection = document.querySelector('.section.highlights');
  const highlightsWrapper = document.querySelector('.highlights-wrapper');

  const totalWidth = highlightsWrapper.scrollWidth - highlightsSection.offsetWidth;

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

export { initHomeHighlights };