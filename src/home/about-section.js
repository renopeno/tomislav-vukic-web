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

  // Izračunaj trajanje title animacije
  const titleChars = titleSplit.chars.map(c => c.querySelector('span'));
  const titleDuration = 1; // duration
  const titleStagger = 0.015;
  const titleTotalTime = titleDuration + ((titleChars.length - 1) * titleStagger);
  
  // Scroll text animacija počinje 0.1s prije nego title završi
  const scrollTextStartTime = titleTotalTime - 0.1;

  // 🎬 MASTER TIMELINE - scroll-driven animacija koja kontrolira obje animacije
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: isMobile ? "top 60%" : "top 85%",
      end: "top 15%",
      scrub: 1,
      id: "about-section-reveal"
    }
  });

  // TITLE REVEAL - scroll-driven masked slide up animacija
  masterTimeline.to(titleChars, {
    y: 0,
    opacity: 1,
    duration: titleDuration,
    stagger: titleStagger,
    ease: "power2.out"
  }, 0); // Počinje na 0

  // SCROLL TEXT REVEAL - počinje 0.1s prije nego title završi
  masterTimeline.to(scrollSplit.chars.map(c => c.querySelector('span')), {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.015,
    ease: "power2.out"
  }, scrollTextStartTime);
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}
