export default function initHighlights() {
  const highlightsSection = document.querySelector('.section.highlights');
  const highlightsWrapper = document.querySelector('.highlights-wrapper');

  // Dodajemo provjeru postojanja potrebnih elemenata
  if (!highlightsSection && !highlightsWrapper) return;

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

  document.addEventListener('DOMContentLoaded', function() {
    // Dohvati sve highlight kartice
    const highlightCards = document.querySelectorAll('.highlights-card');
    
    // Provjeri veličinu ekrana
    const isMobile = window.innerWidth <= 767;
    
    // Postavi početno stanje - sakrij sve kartice
    gsap.set(highlightCards, { 
      opacity: 0,
      y: 50
    });
    
    // Umjesto forEach petlje, animiraj sve kartice odjednom s stagger efektom
    gsap.to(highlightCards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power1.inOut",
      stagger: 0.2, // Razmak između animacija svake kartice
      scrollTrigger: {
        trigger: '.highlights-wrapper',
        start: isMobile ? "top 80%" : "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
}

initHighlights();