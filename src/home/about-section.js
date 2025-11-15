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
  
  // Očisti postojeće ScrollTrigger instance za ovu sekciju
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id === 'home-about-title' || trigger.vars.id === 'about-scroll') {
      console.log('🧹 Čistim stari trigger:', trigger.vars.id);
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
  
  // Home about title - prvih 6 riječi opacity 1, ostale 0.1
  gsap.set(titleSplit.words.slice(0, 6), { opacity: 1 });
  gsap.set(titleSplit.words.slice(6), { opacity: 0.1 });
  
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
    
    // Kreiraj timeline za home-about-title (scroll reveal od riječi 7 nadalje)
    // toggleActions: "play none none none" - animacija se odvija samo pri ulasku, ne vraća unatrag
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: homeAboutTitle,
        start: "top 80%",
        toggleActions: "play none none none",
        markers: true,
        id: "home-about-title",
        onEnter: () => console.log('✅ Title ScrollTrigger: onEnter'),
        onLeave: () => console.log('🚪 Title ScrollTrigger: onLeave'),
        onEnterBack: () => console.log('⬅️ Title ScrollTrigger: onEnterBack'),
        onLeaveBack: () => console.log('⬆️ Title ScrollTrigger: onLeaveBack')
      }
    });
    
    // Animiraj riječi od 7. nadalje: 0.1 -> 1
    titleTl.to(titleSplit.words.slice(6), {
      opacity: 1,
      stagger: 0.015,
      duration: 1.5,
      ease: "power2.out",
      onStart: () => console.log('🎬 Title animacija započela'),
      onComplete: () => console.log('✅ Title animacija završena')
    });
    
    // Kreiraj timeline za about-scroll (nakon završetka title reviewa)
    // toggleActions: "play none none none" - animacija se odvija samo pri ulasku, ne vraća unatrag
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutScroll,
        start: "top 80%",
        toggleActions: "play none none none",
        markers: true,
        id: "about-scroll",
        onEnter: () => console.log('✅ Scroll ScrollTrigger: onEnter'),
        onLeave: () => console.log('🚪 Scroll ScrollTrigger: onLeave'),
        onEnterBack: () => console.log('⬅️ Scroll ScrollTrigger: onEnterBack'),
        onLeaveBack: () => console.log('⬆️ Scroll ScrollTrigger: onLeaveBack')
      }
    });
    
    // Animiraj scroll tekst riječ po riječ
    scrollTl.to(scrollSplit.words, {
      opacity: 1,
      stagger: 0.015,
      duration: 1,
      ease: "power2.out",
      onStart: () => console.log('🎬 Scroll animacija započela'),
      onComplete: () => console.log('✅ Scroll animacija završena')
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

