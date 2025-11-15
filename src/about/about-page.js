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
        opacity: 0;
      }
      
      /* Stil za rečenice paragrafa */
      .sentence {
        opacity: 0.1;
      }
      
      .sentence.first-sentence {
        opacity: 1;
      }
      
      /* Pocetno sakrij sliku sa clip-path */
      .about-page-mobile-img {
        clip-path: inset(100% 0% 0% 0%);
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
    
    // 1. SLIKA - Clip-path reveal (top to bottom)
    if (image) {
      masterTimeline.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: "power2.inOut"
      }, 0);
    }
    
    // 2. TYPEWRITER EFEKT ZA NASLOV - sa pauzama nakon zareza i točaka
    if (title) {
      // Split naslov na riječi i karaktere (riječi ostaju zajedno)
      const titleSplit = new SplitType(title, { 
        types: 'words, chars',
        tagName: 'span'
      });
      splitInstances.push(titleSplit);
      
      if (titleSplit.chars && titleSplit.chars.length > 0) {
        // Dohvati originalni tekst da znamo gdje su zarezi i točke
        const originalText = title.textContent;
        
        // Kreiraj stagger funkciju koja pauzira nakon zareza i točaka
        const staggerFunction = function(index, target, list) {
          const char = originalText[index];
          const prevChar = index > 0 ? originalText[index - 1] : '';
          
          // Ako je prethodni karakter zarez ili točka, dodaj pauzu (0.3s)
          if (prevChar === ',' || prevChar === '.') {
            return 0.3; // Pauza nakon interpunkcije
          }
          
          return 0.03; // Standardna brzina (brža nego prije)
        };
        
        // Typewriter animacija sa custom stagger funkcijom
        masterTimeline.to(titleSplit.chars, {
          opacity: 1,
          duration: 0.03,
          stagger: staggerFunction,
          ease: "none"
        }, "+=0.2"); // Počinje 0.2s nakon što slika završi
      }
    }
    
    // 3. PARAGRAF - Prvo samo prva rečenica, ostalo na scroll
    if (paragraph) {
      // Dohvati cijeli tekst paragrafa
      const paragraphText = paragraph.textContent;
      
      // Razdvoji tekst na rečenice (nakon točke + razmak)
      const sentences = paragraphText.split(/(?<=\.)\s+/);
      
      // Očisti paragraf i rebuild sa span elementima
      paragraph.innerHTML = '';
      
      sentences.forEach((sentence, index) => {
        const span = document.createElement('span');
        span.className = index === 0 ? 'sentence first-sentence' : 'sentence';
        span.textContent = sentence + (index < sentences.length - 1 ? ' ' : '');
        paragraph.appendChild(span);
      });
      
      // Ostale rečenice (ne prva) - scroll reveal
      const otherSentences = paragraph.querySelectorAll('.sentence:not(.first-sentence)');
      
      if (otherSentences.length > 0) {
        otherSentences.forEach((sentence, index) => {
          ScrollTrigger.create({
            trigger: index === 0 ? paragraph : otherSentences[index - 1],
            start: index === 0 ? "top 75%" : "top 85%",
            onEnter: () => {
              gsap.to(sentence, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
              });
            },
            once: true
          });
        });
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
