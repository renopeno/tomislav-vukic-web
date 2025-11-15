function initAboutSection() {
  const aboutSection = document.querySelector('.section.about');
  if (!aboutSection) return;
  
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');
  
  if (!homeAboutTitle || !aboutScroll) {
    console.warn('About section elementi nisu pronađeni');
    return;
  }
  
  // Registriraj ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // Očisti SVE ScrollTrigger instance vezane za about sekciju
  const existingTriggers = ScrollTrigger.getAll();
  console.log('🧹 Čistim sve about section triggere, pronađeno:', existingTriggers.length);
  existingTriggers.forEach(trigger => {
    if (trigger.vars.id === 'home-about-title' || trigger.vars.id === 'about-scroll') {
      console.log('  ❌ Uklanjam trigger:', trigger.vars.id);
      trigger.kill();
    }
  });
  
  // SplitType za podjelu teksta na riječi
  const titleSplit = new SplitType(homeAboutTitle, { 
    types: 'words',
    tagName: 'span'
  });
  
  const scrollSplit = new SplitType(aboutScroll, { 
    types: 'words',
    tagName: 'span'
  });
  
  // CSS za inline prikaz riječi
  if (!document.getElementById('about-section-styles')) {
    const style = document.createElement('style');
    style.id = 'about-section-styles';
    style.textContent = `
      .word {
        display: inline !important;
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Home about title - prvih 6 riječi opacity 1, ostale 0.05 (jasniji kontrast)
  gsap.set(titleSplit.words.slice(0, 6), { opacity: 1 });
  gsap.set(titleSplit.words.slice(6), { opacity: 0.05 });
  
  // Scroll tekst - početna opacity 0
  gsap.set(scrollSplit.words, { opacity: 0 });
  
  // Pričekaj da se layout stabilizira, onda osvježi ScrollTrigger
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    
    console.log('📍 About section ScrollTrigger setup:', {
      homeAboutTitle,
      aboutScroll,
      titleWords: titleSplit.words.length,
      scrollWords: scrollSplit.words.length
    });
    
    console.log('📊 Trenutno aktivnih ScrollTrigger instanci:', ScrollTrigger.getAll().length);
    
    // Kreiraj timeline za home-about-title (scroll reveal od riječi 7 nadalje)
    // scrub: riječ po riječ reveal dok scrollaš
    let titleCompleted = false;
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: homeAboutTitle,
        start: "top 80%",
        end: "bottom 30%",
        scrub: 0.5,
        markers: true,
        id: "home-about-title",
        onEnter: () => console.log('✅ Title ScrollTrigger: onEnter'),
        onLeave: () => console.log('🚪 Title ScrollTrigger: onLeave'),
        onEnterBack: () => {
          console.log('⬅️ Title ScrollTrigger: onEnterBack');
          // Ako je već completed, postavi sve na opacity 1
          if (titleCompleted) {
            gsap.set(titleSplit.words.slice(6), { opacity: 1 });
          }
        },
        onLeaveBack: () => {
          console.log('⬆️ Title ScrollTrigger: onLeaveBack');
          // Ako je completed, zaustavi scrub i drži revealed
          if (titleCompleted) {
            gsap.set(titleSplit.words.slice(6), { opacity: 1 });
          }
        },
        onComplete: () => {
          console.log('✅ Title ScrollTrigger COMPLETED - ostajem revealed');
          titleCompleted = true;
          // Zaustavi scrub nakon što je completed
          gsap.set(titleSplit.words.slice(6), { opacity: 1 });
        }
      }
    });
    
    // Animiraj riječi od 7. nadalje: 0.05 -> 1 (scrub animacija)
    titleTl.to(titleSplit.words.slice(6), {
      opacity: 1,
      stagger: 0.015,
      ease: "none"
    });
    
    // Kreiraj timeline za about-scroll (nakon završetka title reviewa)
    // scrub: riječ po riječ reveal dok scrollaš
    let scrollCompleted = false;
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutScroll,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.5,
        markers: true,
        id: "about-scroll",
        onEnter: () => console.log('✅ Scroll ScrollTrigger: onEnter'),
        onLeave: () => console.log('🚪 Scroll ScrollTrigger: onLeave'),
        onEnterBack: () => {
          console.log('⬅️ Scroll ScrollTrigger: onEnterBack');
          // Ako je već completed, postavi sve na opacity 1
          if (scrollCompleted) {
            gsap.set(scrollSplit.words, { opacity: 1 });
          }
        },
        onLeaveBack: () => {
          console.log('⬆️ Scroll ScrollTrigger: onLeaveBack');
          // Ako je completed, zaustavi scrub i drži revealed
          if (scrollCompleted) {
            gsap.set(scrollSplit.words, { opacity: 1 });
          }
        },
        onComplete: () => {
          console.log('✅ Scroll ScrollTrigger COMPLETED - ostajem revealed');
          scrollCompleted = true;
          // Zaustavi scrub nakon što je completed
          gsap.set(scrollSplit.words, { opacity: 1 });
        }
      }
    });
    
    // Animiraj scroll tekst riječ po riječ (scrub animacija)
    scrollTl.to(scrollSplit.words, {
      opacity: 1,
      stagger: 0.015,
      ease: "none"
    });
    
    console.log('🎯 ScrollTrigger animacije kreirane');
  });
}

// Izvezi funkciju globalno za Barba
window.initAboutSection = initAboutSection;

// Pokreni funkciju na prvom učitavanju stranice
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}

