function initAboutSection() {
  // Dodajemo provjeru za sekciju i potrebne elemente
  const aboutSection = document.querySelector('.section.about');
  if (!aboutSection) return;
  
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
  
  // Postavi početnu vidljivost riječi na 0
  gsap.set(titleSplit.words, { opacity: 0 });
  gsap.set(scrollSplit.words, { opacity: 0 });
  
  // Kreiraj timeline za naslov
  const titleTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about-reveal-start',
      endTrigger: '.about-reveal-end',
      start: "top 100%",
      end: "top 20%",
      scrub: 0.5
    }
  });
  
  // Animiraj naslov
  titleTl.to(titleSplit.words, {
    opacity: 1,
    stagger: 0.015,
    ease: "power2.out"
  });
  
  // Kreiraj timeline za scroll tekst
  const scrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.about-title',
        endTrigger: '.about-reveal-end',
        start: "center 70%",
        end: "top 40%",
        scrub: 0.5,
        markers: false
    }
  });
  
  // Animiraj scroll tekst
  scrollTl.to(scrollSplit.words, {
    opacity: 1,
    stagger: 0.015,
    ease: "power2.out"
  });
}

// Izvezi funkciju globalno za Barba
window.initAboutSection = initAboutSection;

