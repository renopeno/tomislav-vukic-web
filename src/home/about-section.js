function initAboutSection() {
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!homeAboutTitle || !aboutScroll) return;

  gsap.registerPlugin(ScrollTrigger);

  // Split text u riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  // Početno stanje
  gsap.set(titleSplit.words.slice(0, 6), { opacity: 1 });
  gsap.set(titleSplit.words.slice(6), { opacity: 0 });
  gsap.set(scrollSplit.words, { opacity: 0 });

  // Reveal kad uđe u viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target === homeAboutTitle) {
        gsap.to(titleSplit.words.slice(6), {
          opacity: 1,
          duration: 0.05,
          stagger: 0.05,
          ease: "none"
        });
        observer.unobserve(homeAboutTitle);
      }
      
      if (entry.isIntersecting && entry.target === aboutScroll) {
        gsap.to(scrollSplit.words, {
          opacity: 1,
          duration: 0.05,
          stagger: 0.05,
          ease: "none"
        });
        observer.unobserve(aboutScroll);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(homeAboutTitle);
  observer.observe(aboutScroll);
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}

