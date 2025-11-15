function initAboutSection() {
  const barbaContainer = document.querySelector('[data-barba-namespace="home"]');
  
  if (!barbaContainer) {
    return;
  }
  
  const aboutSection = document.querySelector('.section.about');
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!aboutScroll || !aboutSection || !homeAboutTitle) {
    console.error('❌ About Section elementi nisu kompletni');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Split text u riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  // Postavi styling za masked reveal efekt
  titleSplit.words.forEach(word => {
    gsap.set(word, { 
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'top'
    });
  });

  scrollSplit.words.forEach(word => {
    gsap.set(word, { 
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'top'
    });
  });

  // Wrap svaku riječ u inner span za slide-up efekt
  const wrapWords = (words) => {
    words.forEach(word => {
      const text = word.textContent;
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = text;
      word.textContent = '';
      word.appendChild(inner);
      
      // Inicijalno stanje - sakriveno ispod
      gsap.set(inner, { 
        y: '100%',
        opacity: 0
      });
    });
  };

  wrapWords(titleSplit.words);
  wrapWords(scrollSplit.words);

  // Prvih 6 riječi odmah vidljivo
  titleSplit.words.slice(0, 6).forEach(word => {
    const inner = word.querySelector('span');
    gsap.set(inner, { y: 0, opacity: 1 });
  });

  // 🎬 TITLE REVEAL - masked slide up animacija
  gsap.to(titleSplit.words.slice(6).map(w => w.querySelector('span')), {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.015,
    ease: "power2.out",
    scrollTrigger: {
      trigger: aboutSection,
      start: "top 60%",
      toggleActions: "play none none none",
      once: true,
      id: "about-title-reveal"
    }
  });

  // 🎬 SCROLL TEXT REVEAL - masked slide up animacija
  gsap.to(scrollSplit.words.map(w => w.querySelector('span')), {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.015,
    ease: "power2.out",
    scrollTrigger: {
      trigger: aboutScroll,
      start: "top 80%",
      toggleActions: "play none none none",
      once: true,
      id: "about-scroll-reveal"
    }
  });
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}
