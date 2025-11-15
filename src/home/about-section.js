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
  
  // Home about title - prvih 6 riječi opacity 1, ostale 0
  gsap.set(titleSplit.words.slice(0, 6), { opacity: 1 });
  gsap.set(titleSplit.words.slice(6), { opacity: 0 });
  
  // Scroll tekst - početna opacity 0
  gsap.set(scrollSplit.words, { opacity: 0 });
  
  // Pričekaj da se layout stabilizira
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    
    // Prateći maksimalni progress - jednom revealed, ostaje revealed
    let titleMaxProgress = 0;
    let scrollMaxProgress = 0;
    
    // Timeline za home-about-title - riječ po riječ reveal
    ScrollTrigger.create({
      trigger: homeAboutTitle,
      start: "top 80%",
      end: "bottom 30%",
      id: "home-about-title",
      onUpdate: (self) => {
        // Prati maksimalni progress
        if (self.progress > titleMaxProgress) {
          titleMaxProgress = self.progress;
        }
        
        // Animiraj riječi na temelju maksimalnog progressa
        const wordsToReveal = titleSplit.words.slice(6);
        const totalWords = wordsToReveal.length;
        
        wordsToReveal.forEach((word, index) => {
          const wordProgress = index / totalWords;
          if (titleMaxProgress > wordProgress) {
            gsap.to(word, { opacity: 1, duration: 0.3, overwrite: true });
          }
        });
      }
    });
    
    // Timeline za about-scroll - riječ po riječ reveal
    ScrollTrigger.create({
      trigger: aboutScroll,
      start: "top 80%",
      end: "bottom 40%",
      id: "about-scroll",
      onUpdate: (self) => {
        // Prati maksimalni progress
        if (self.progress > scrollMaxProgress) {
          scrollMaxProgress = self.progress;
        }
        
        // Animiraj riječi na temelju maksimalnog progressa
        const wordsToReveal = scrollSplit.words;
        const totalWords = wordsToReveal.length;
        
        wordsToReveal.forEach((word, index) => {
          const wordProgress = index / totalWords;
          if (scrollMaxProgress > wordProgress) {
            gsap.to(word, { opacity: 1, duration: 0.3, overwrite: true });
          }
        });
      }
    });
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
