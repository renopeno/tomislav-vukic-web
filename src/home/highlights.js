function initHighlights() {
  const highlightsSection = document.querySelector('.section.highlights');
  const highlightsWrapper = document.querySelector('.highlights-wrapper');

  if (!highlightsSection || !highlightsWrapper) return;

  gsap.registerPlugin(ScrollTrigger);

  const totalWidth = highlightsWrapper.scrollWidth - highlightsSection.offsetWidth;

  // Horizontal scroll animacija - SA PIN-om i optimiziranim scrub-om
  gsap.to(highlightsWrapper, {
    x: -totalWidth,
    ease: "none",
    scrollTrigger: {
      trigger: highlightsSection,
      start: "top top",
      end: `+=${totalWidth}`,
      scrub: 3,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      id: "highlights-horizontal"
    },
  });

  // Kartice fade-in animacija
  const highlightCards = document.querySelectorAll('.highlights-card');
  const isMobile = window.innerWidth <= 767;
  
  gsap.set(highlightCards, { 
    opacity: 0,
    y: 50
  });
  
  gsap.to(highlightCards, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power1.inOut",
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.highlights-wrapper',
      start: isMobile ? "top 80%" : "top 80%",
      toggleActions: "play none none none",
      id: "highlights-cards"
    }
  });
}

window.initHighlights = initHighlights;
initHighlights();