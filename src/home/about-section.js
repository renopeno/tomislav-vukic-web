function initAboutSection() {
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!homeAboutTitle || !aboutScroll) return;

  gsap.registerPlugin(ScrollTrigger);

  // Split text u riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  // CSS za masked slide-up efekt
  const style = document.createElement('style');
  style.textContent = `
    .word {
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
    }
    .word-inner {
      display: inline-block;
      opacity: 0.1;
      transform: translateY(100%);
    }
  `;
  document.head.appendChild(style);

  // Wrap svaku riječ u inner span za slide-up efekt
  const wrapWords = (words) => {
    words.forEach(word => {
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = word.textContent;
      word.textContent = '';
      word.appendChild(inner);
    });
  };

  wrapWords(titleSplit.words);
  wrapWords(scrollSplit.words);

  // Prvih 6 riječi već revealed
  titleSplit.words.slice(0, 6).forEach(word => {
    const inner = word.querySelector('.word-inner');
    gsap.set(inner, { opacity: 1, y: 0 });
  });

  // Masked reveal za title - slide up from bottom
  gsap.to(titleSplit.words.slice(6).map(w => w.querySelector('.word-inner')), {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.02,
    ease: "power2.out",
    scrollTrigger: {
      trigger: homeAboutTitle,
      start: "top 70%",
      end: "bottom 40%",
      scrub: 0.5,
      id: "about-title"
    }
  });

  // Masked reveal za scroll text - slide up from bottom
  gsap.to(scrollSplit.words.map(w => w.querySelector('.word-inner')), {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.02,
    ease: "power2.out",
    scrollTrigger: {
      trigger: aboutScroll,
      start: "top 70%",
      end: "bottom 40%",
      scrub: 0.5,
      id: "about-scroll"
    }
  });
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}
