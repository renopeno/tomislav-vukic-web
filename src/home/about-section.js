function initAboutSection() {
  // Dodajemo provjeru za sekciju i potrebne elemente
  const aboutSection = document.querySelector('.section.about');
  if (!aboutSection) return;
  
  const aboutSideTitle = document.querySelector('.about-side-title');
  const aboutTitle = document.querySelector('.about-title');
  const aboutScroll = document.querySelector('.about-scroll');
  
  // Provjeri da li elementi postoje prije nego što nastaviš
  if (!aboutTitle || !aboutScroll) {
    console.warn('About section elementi nisu pronađeni');
    return;
  }
  
  // Koristi SplitType za podjelu teksta na riječi, s tagName: 'span' opcijom
  const titleSplit = new SplitType(aboutTitle, { 
    types: 'words',
    tagName: 'span'  // Koristi span umjesto div
  });
  
  const scrollSplit = new SplitType(aboutScroll, { 
    types: 'words',
    tagName: 'span'  // Koristi span umjesto div
  });
  
  // Dodaj CSS koji postavlja riječi kao inline elemente (samo ako još nije dodan)
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
  
  // Postavi početnu vidljivost elemenata na 0
  if (aboutSideTitle) {
    gsap.set(aboutSideTitle, { opacity: 0, y: 20 });
  }
  gsap.set(titleSplit.words, { opacity: 0 });
  gsap.set(scrollSplit.words, { opacity: 0 });
  
  // 1. Animiraj "About me" naslov kad sekcija uđe u viewport na 20%
  if (aboutSideTitle) {
    gsap.to(aboutSideTitle, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  }
  
  // 2. Kreiraj scroll reveal timeline za glavni tekst
  const titleTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about-reveal-start',
      endTrigger: '.about-reveal-end',
      start: "top 80%",
      end: "top 20%",
      scrub: 0.5,
      invalidateOnRefresh: true
    }
  });
  
  // Animiraj glavni tekst riječ po riječ
  titleTl.to(titleSplit.words, {
    opacity: 1,
    stagger: 0.015,
    ease: "none"
  });
  
  // 3. Kreiraj timeline za scroll tekst (prikazuje se na kraju)
  const scrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.about-title',
        endTrigger: '.about-reveal-end',
        start: "center 60%",
        end: "bottom 40%",
        scrub: 0.5,
        invalidateOnRefresh: true
    }
  });
  
  // Animiraj scroll tekst
  scrollTl.to(scrollSplit.words, {
    opacity: 1,
    stagger: 0.015,
    ease: "none"
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

