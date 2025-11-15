function initAboutSection() {
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!homeAboutTitle || !aboutScroll) return;

  gsap.registerPlugin(ScrollTrigger);

  // Split text u riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  // CSS za mask efekt
  const style = document.createElement('style');
  style.textContent = `
    .word {
      display: inline-block;
      opacity: 0.1;
    }
  `;
  document.head.appendChild(style);

  // Prvih 6 riječi vidljivo
  titleSplit.words.slice(0, 6).forEach(word => {
    word.style.opacity = '1';
  });

  // Masked reveal za title
  gsap.to(titleSplit.words.slice(6), {
    opacity: 1,
    duration: 1,
    stagger: 0.03,
    ease: "none",
    scrollTrigger: {
      trigger: homeAboutTitle,
      start: "top 70%",
      end: "bottom 40%",
      scrub: 1
    }
  });

  // Masked reveal za scroll text
  gsap.to(scrollSplit.words, {
    opacity: 1,
    duration: 1,
    stagger: 0.03,
    ease: "none",
    scrollTrigger: {
      trigger: aboutScroll,
      start: "top 70%",
      end: "bottom 40%",
      scrub: 1
    }
  });
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}
