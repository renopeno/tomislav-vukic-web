export default function initAboutSection() {
    // Dodajemo provjeru za sekciju i potrebne elemente
    const aboutSection = document.querySelector('.section.about');
    if (!aboutSection) return;
    
    const aboutTitle = document.querySelector('.about-title');
    const aboutParagraph = document.querySelector('.about-paragraph');
    const aboutScroll = document.querySelector('.about-scroll');
    
    // Koristi SplitType za podjelu teksta na riječi, s tagName: 'span' opcijom
    const titleSplit = new SplitType(aboutTitle, { 
      types: 'words',
      tagName: 'span'  // Koristi span umjesto div
    });
    
    const paragraphSplit = new SplitType(aboutParagraph, { 
      types: 'words',
      tagName: 'span'  // Koristi span umjesto div
    });
    
    const scrollSplit = new SplitType(aboutScroll, { 
      types: 'words',
      tagName: 'span'  // Koristi span umjesto div
    });
    
    // Dodaj CSS koji postavlja riječi kao inline elemente
    const style = document.createElement('style');
    style.textContent = `
      .word {
        display: inline !important;
        position: relative;
      }
    `;
    document.head.appendChild(style);
    
    // Postavi početnu vidljivost riječi na 0
    gsap.set(titleSplit.words, { opacity: 0 });
    gsap.set(paragraphSplit.words, { opacity: 0 });
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
    
    // Kreiraj timeline za paragraf
    const paragraphTl = gsap.timeline({
      scrollTrigger: {
          trigger: '.about-paragraph',
          endTrigger: '.about-paragraph',
          start: "top 70%",
          end: "top 30%",
          scrub: 0.5,
          markers: false
      }
    });
    
    // Animiraj paragraf
    paragraphTl.to(paragraphSplit.words, {
      opacity: 1,
      stagger: 0.01,
      ease: "power2.out"
    });
    
    // Kreiraj timeline za scroll tekst
    const scrollTl = gsap.timeline({
      scrollTrigger: {
          trigger: '.about-paragraph',
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

  initAboutSection();

