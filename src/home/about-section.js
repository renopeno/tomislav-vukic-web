function initAboutSection() {
  console.log('🎬 initAboutSection pozvana');
  
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!homeAboutTitle || !aboutScroll) {
    console.warn('❌ About elementi nisu pronađeni');
    return;
  }

  console.log('✅ Elementi pronađeni:', { homeAboutTitle, aboutScroll });

  gsap.registerPlugin(ScrollTrigger);

  // Očisti postojeće ScrollTrigger instance
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id?.includes('about-')) {
      trigger.kill();
    }
  });

  // Split text u riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  console.log('📝 Split gotov:', {
    titleWords: titleSplit.words.length,
    scrollWords: scrollSplit.words.length
  });

  // Postavi početne opacitye - prvih 6 riječi vidljivo, ostalo 0.1
  gsap.set(titleSplit.words.slice(0, 6), { opacity: 1 });
  gsap.set(titleSplit.words.slice(6), { opacity: 0.1 });
  gsap.set(scrollSplit.words, { opacity: 0.1 });

  // Pričekaj da se layout stabilizira
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    // Animacija za home-about-title (od 7. riječi nadalje)
    gsap.to(titleSplit.words.slice(6), {
      opacity: 1,
      stagger: 0.02,
      ease: "none",
      scrollTrigger: {
        trigger: homeAboutTitle,
        start: "top 80%",
        end: "bottom 30%",
        scrub: true,
        markers: true,
        id: "about-title"
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
        scrub: true,
        markers: true,
        id: "about-scroll"
      }
    });

    console.log('🎯 ScrollTrigger animacije kreirane');
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

