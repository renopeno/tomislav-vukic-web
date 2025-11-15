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
      .about-page-title .word {
        display: inline-block;
        white-space: nowrap;
      }
      
      .about-page-title .char {
        display: inline-block;
        opacity: 0.1;
      }
      
      /* Stil za linije paragrafa */
      .about-page-paragraph .line {
        display: block;
        opacity: 0.1;
      }
      
      /* Pocetno sakrij sliku sa clip-path (od gore prema dolje) */
      .about-page-mobile-img {
        clip-path: inset(0% 0% 100% 0%);
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
    
    // 1. SLIKA - Clip-path reveal (od gore prema dolje)
    if (image) {
      masterTimeline.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: "power2.inOut"
      }, 0);
    }
    
    // 2. TYPEWRITER EFEKT ZA NASLOV - počinje usred revealing slike
    if (title) {
      // Split naslov na riječi i karaktere (riječi ostaju zajedno)
      const titleSplit = new SplitType(title, { 
        types: 'words,chars',
        tagName: 'span'
      });
      splitInstances.push(titleSplit);
      
      if (titleSplit.chars && titleSplit.chars.length > 0) {
        // Spremimo originalni tekst prije splita
        const chars = titleSplit.chars;
        
        // Typewriter animacija s manualnim staggerom za pauze
        let delay = 0;
        chars.forEach((char, index) => {
          const charText = char.textContent;
          
          // Animiraj svaki karakter
          masterTimeline.to(char, {
            opacity: 1,
            duration: 0.05,
            ease: "none"
          }, 0.7 + delay); // Počinje nakon 0.7s (usred slike)
          
          // Dodaj delay za sljedeći karakter
          delay += 0.04; // Brza standardna brzina
          
          // Ako je trenutni karakter zarez ili točka, dodaj ekstra pauzu
          if (charText === ',' || charText === '.') {
            delay += 0.4; // Pauza nakon interpunkcije
          }
        });
      }
    }
    
    // 3. PARAGRAF - Prikaži prvu liniju nakon typewritera, ostalo scroll reveal
    let paragraphTimeline = null;
    if (paragraph) {
      // Split paragraf na linije
      const paragraphSplit = new SplitType(paragraph, { 
        types: 'lines',
        lineClass: 'line'
      });
      splitInstances.push(paragraphSplit);
      
      if (paragraphSplit.lines && paragraphSplit.lines.length > 0) {
        const lines = paragraphSplit.lines;
        
        // Dodaj prvu liniju u master timeline (nakon typewritera)
        masterTimeline.to(lines[0], {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "+=0.3");
        
        // Ostale linije - scroll reveal red po red
        if (lines.length > 1) {
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const prevLine = lines[i - 1];
            
            ScrollTrigger.create({
              trigger: prevLine,
              start: "top 80%",
              onEnter: () => {
                gsap.to(line, {
                  opacity: 1,
                  duration: 0.5,
                  ease: "power2.out"
                });
              },
              once: true,
              markers: false
            });
          }
        }
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
