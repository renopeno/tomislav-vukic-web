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

  // Split text prvo na riječi, pa na karaktere - sprječava lomljenje riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words,chars' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words,chars' });

  // Postavi styling za riječi - svaka riječ je inline-block da se ne lomi
  if (titleSplit.words) {
    titleSplit.words.forEach(word => {
      gsap.set(word, { 
        display: 'inline-block',
        whiteSpace: 'nowrap'
      });
    });
  }

  if (scrollSplit.words) {
    scrollSplit.words.forEach(word => {
      gsap.set(word, { 
        display: 'inline-block',
        whiteSpace: 'nowrap'
      });
    });
  }

  // Postavi styling za masked reveal efekt na karakterima
  titleSplit.chars.forEach(char => {
    gsap.set(char, { 
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'top'
    });
  });

  scrollSplit.chars.forEach(char => {
    gsap.set(char, { 
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'top'
    });
  });

  // Wrap svaki karakter u inner span za slide-up efekt
  const wrapChars = (chars) => {
    chars.forEach(char => {
      const text = char.textContent;
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = text;
      char.textContent = '';
      char.appendChild(inner);
      
      // Inicijalno stanje - sakriveno ispod
      gsap.set(inner, { 
        y: '100%',
        opacity: 0
      });
    });
  };

  wrapChars(titleSplit.chars);
  wrapChars(scrollSplit.chars);

  // Provjera za mobile
  const isMobile = window.innerWidth <= 767;

  // 🎬 TITLE REVEAL - scroll-driven masked slide up animacija s elastic efektom
  const titleTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: isMobile ? "top 60%" : "top 85%",
      end: "top 15%",
      scrub: 1,
      id: "about-title-reveal"
    }
  });

  titleTimeline.to(titleSplit.chars.map(c => c.querySelector('span')), {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.015,
    ease: "power2.out"
  });

  // 🎬 SCROLL TEXT REVEAL - scroll-driven masked slide up animacija
  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: aboutScroll,
      start: isMobile ? "top 50%" : "top 95%",
      end: "top 25%",
      scrub: 1,
      id: "about-scroll-reveal"
    }
  });

  scrollTimeline.to(scrollSplit.chars.map(c => c.querySelector('span')), {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.015,
    ease: "power2.out"
  });
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}
