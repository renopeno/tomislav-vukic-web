function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // CSS za animacije
    const style = document.createElement('style');
    style.textContent = `
      .about-page-title,
      .about-page-paragraph {
        position: relative;
        z-index: 1;
      }
      
      /* Typewriter stil za naslov */
      .char {
        display: inline-block;
        opacity: 0;
      }
      
      /* Stil za linije paragrafa */
      .reveal-line {
        display: block !important;
        overflow: visible;
        line-height: inherit;
        margin: 0;
        padding: 0;
        opacity: 0;
      }
      
      .reveal-line > div,
      .reveal-line > span {
        display: inline;
        white-space: normal;
      }
      
      /* Pocetno sakrij sliku */
      .about-page-mobile-img {
        opacity: 0;
        filter: blur(20px);
      }
    `;
    document.head.appendChild(style);
    
    // Dohvati elemente
    const section = document.querySelector('.section.about-page');
    const title = document.querySelector('.about-page-title');
    const paragraph = document.querySelector('.about-page-paragraph');
    const image = document.querySelector('.about-page-mobile-img');
    
    // Provjeri postoje li elementi
    if (!title && !paragraph && !image) return;
    
    // Instanca za split text cleanup
    const splitInstances = [];
    
    // Kreiraj glavni timeline
    const masterTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        console.log('About page animacija završena');
      }
    });
    
    // 1. SLIKA - Blur to Clear + Fade In
    if (image) {
      masterTimeline.to(image, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: "power3.out"
      }, 0);
    }
    
    // 2. TYPEWRITER EFEKT ZA NASLOV
    if (title) {
      // Split naslov na karaktere
      const titleSplit = new SplitType(title, { 
        types: 'chars',
        tagName: 'span'
      });
      splitInstances.push(titleSplit);
      
      if (titleSplit.chars && titleSplit.chars.length > 0) {
        // Typewriter animacija - svaki karakter se pojavljuje jedan za drugim
        masterTimeline.to(titleSplit.chars, {
          opacity: 1,
          duration: 0.05,
          stagger: 0.05, // 50ms između svakog slova
          ease: "none"
        }, "+=0.3"); // Počinje 0.3s nakon što slika završi
      }
    }
    
    // 3. PARAGRAF - Red po Red
    if (paragraph) {
      // Split paragraf na linije
      const paragraphSplit = new SplitType(paragraph, { 
        types: 'lines',
        lineClass: 'reveal-line'
      });
      splitInstances.push(paragraphSplit);
      
      if (paragraphSplit.lines && paragraphSplit.lines.length > 0) {
        // Animiraj svaku liniju sa staggeorm
        masterTimeline.to(paragraphSplit.lines, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15, // 150ms između svakog reda
          ease: "power2.out"
        }, "+=0.2"); // Počinje 0.2s nakon typewritera
      }
    }
    
    // Pokreni animaciju kada sekcija uđe u viewport
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        masterTimeline.play();
      }
    });
    
    // Sticky efekt za about section
    ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      endTrigger: ".footer",
      end: "bottom bottom",
      pinSpacing: false,
      pin: true,
      markers: false
    });
    
    // Cleanup za Barba.js transitions
    if (typeof barba !== 'undefined') {
      barba.hooks.beforeLeave(() => {
        // Revert split text
        splitInstances.forEach(split => {
          if (split && split.revert) split.revert();
        });
        // Clear timeline
        if (masterTimeline) masterTimeline.kill();
        // Clear ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // Clear style tag
        if (style && style.parentNode) {
          style.parentNode.removeChild(style);
        }
      });
    }
  });
}

window.initAbout = initAbout;
initAbout();
