function initAboutSection() {
  const aboutSection = document.querySelector('.section.about');
  if (!aboutSection) return;
  
  const aboutSideTitle = document.querySelector('.about-side-title');
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');
  
  if (!homeAboutTitle || !aboutScroll) {
    console.warn('About section elementi nisu pronađeni');
    return;
  }
  
  // Registriraj ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
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
  
  // 1. About me naslov - UVIJEK VIDLJIV
  if (aboutSideTitle) {
    gsap.set(aboutSideTitle, { opacity: 1 });
  }
  
  // 2. Home about title - prvih 6 riječi opacity 1, ostale 0.1
  const firstSixWords = Array.from(titleSplit.words).slice(0, 6);
  const remainingWords = Array.from(titleSplit.words).slice(6);
  
  console.log('Prvih 6 riječi:', firstSixWords.length, firstSixWords);
  console.log('Preostale riječi:', remainingWords.length, remainingWords);
  
  gsap.set(firstSixWords, { opacity: 1 });
  gsap.set(remainingWords, { opacity: 0.1 });
  
  // 3. Scroll tekst - početna opacity 0
  gsap.set(scrollSplit.words, { opacity: 0 });
  
  console.log('GSAP set primjenjen, osvježavam ScrollTrigger...');
  
  // Osvježi ScrollTrigger nakon što su riječi postavljene
  ScrollTrigger.refresh();
  
  // Scroll reveal animacija za home-about-title (riječi od 7. nadalje)
  if (remainingWords.length > 0) {
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 80%",
        end: "top 20%",
        scrub: 0.5,
        invalidateOnRefresh: true,
        markers: true,
        id: "title-reveal",
        onUpdate: (self) => {
          console.log('Title reveal progress:', self.progress);
        }
      }
    });
    
    // Animiraj riječi od 7. nadalje: 0.1 -> 1
    titleTl.to(remainingWords, {
      opacity: 1,
      stagger: 0.015,
      ease: "none"
    });
    
    console.log('Title timeline kreiran za', remainingWords.length, 'riječi');
  }
  
  // Scroll reveal za about-scroll tekst (nakon završetka home-about-title)
  if (scrollSplit.words.length > 0) {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 20%",
        end: "top -30%",
        scrub: 0.5,
        invalidateOnRefresh: true,
        markers: true,
        id: "scroll-reveal",
        onUpdate: (self) => {
          console.log('Scroll reveal progress:', self.progress);
        }
      }
    });
    
    // Animiraj scroll tekst riječ po riječ
    scrollTl.to(scrollSplit.words, {
      opacity: 1,
      stagger: 0.015,
      ease: "none"
    });
    
    console.log('Scroll timeline kreiran za', scrollSplit.words.length, 'riječi');
  }
  
  console.log('About section scroll reveal GOTOV!');
}

// Izvezi funkciju globalno za Barba
window.initAboutSection = initAboutSection;

// Pokreni funkciju na prvom učitavanju stranice
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}

