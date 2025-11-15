function initAboutSection() {
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!homeAboutTitle || !aboutScroll) return;

  gsap.registerPlugin(ScrollTrigger);

  // Split text u riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  // Postavi početne opacitye - prvih 6 riječi vidljivo, ostalo 0.1
  gsap.set(titleSplit.words.slice(0, 6), { opacity: 1 });
  gsap.set(titleSplit.words.slice(6), { opacity: 0.1 });
  gsap.set(scrollSplit.words, { opacity: 0.1 });

  // Animacija za home-about-title (od 7. riječi nadalje)
  gsap.to(titleSplit.words.slice(6), {
    opacity: 1,
    stagger: 0.02,
    ease: "none",
    scrollTrigger: {
      trigger: homeAboutTitle,
      start: "top 80%",
      end: "bottom 30%",
      scrub: true
    }
  });

  // Animacija za about-scroll
  gsap.to(scrollSplit.words, {
    opacity: 1,
    stagger: 0.02,
    ease: "none",
    scrollTrigger: {
      trigger: aboutScroll,
      start: "top 80%",
      end: "bottom 40%",
      scrub: true
    }
  });
}

// Export globalno za Barba
window.initAboutSection = initAboutSection;

// Init na page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}

