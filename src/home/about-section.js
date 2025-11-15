function initAboutSection() {
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!homeAboutTitle || !aboutScroll) return;

  gsap.registerPlugin(ScrollTrigger);

  // Split text
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  // Početna opacity
  gsap.set(titleSplit.words.slice(0, 6), { opacity: 1 });
  gsap.set(titleSplit.words.slice(6), { opacity: 0.1 });
  gsap.set(scrollSplit.words, { opacity: 0.1 });

  // Reveal na scroll - SAMO JEDNOM
  ScrollTrigger.create({
    trigger: homeAboutTitle,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(titleSplit.words.slice(6), {
        opacity: 1,
        duration: 0.05,
        stagger: 0.05,
        ease: "none"
      });
    }
  });

  ScrollTrigger.create({
    trigger: aboutScroll,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(scrollSplit.words, {
        opacity: 1,
        duration: 0.05,
        stagger: 0.05,
        ease: "none"
      });
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

