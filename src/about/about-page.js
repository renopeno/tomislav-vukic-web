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
      
      /* Sakrij paragraf dok typewriter ne završi */
      .about-page-paragraph {
        opacity: 0;
      }
      
      /* Pocetno sakrij sliku sa clip-path (od gore prema dolje) */
      .about-page-mobile-img {
        clip-path: inset(0% 0% 100% 0%);
      }
      
      /* Typewriter cursor */
      .typewriter-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background-color: var(--text-color, currentColor);
        margin-left: 4px;
        margin-right: 2px;
        opacity: 0;
        vertical-align: text-bottom;
      }
      
      .typewriter-cursor.active {
        animation: blink 0.7s steps(1, end) infinite;
      }
      
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      /* Stil za linije paragrafa */
      .about-page-paragraph .line {
        display: block;
        opacity: 0;
      }
      
      /* Paragraf riječi wrap */
      .about-page-paragraph .word {
        display: inline-block;
        white-space: nowrap;
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
    
    // 1. SLIKA - Clip-path reveal (od gore prema dolje) - brži i jači easing
    if (image) {
      masterTimeline.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        ease: "power3.inOut"
      }, 0);
    }
    
    // 2. TYPEWRITER EFEKT ZA NASLOV - počinje usred revealing slike
    let typewriterEndTime = 0;
    if (title) {
      // Split naslov na riječi i karaktere (riječi ostaju zajedno)
      const titleSplit = new SplitType(title, { 
        types: 'words,chars',
        tagName: 'span'
      });
      splitInstances.push(titleSplit);
      
      if (titleSplit.chars && titleSplit.chars.length > 0) {
        const chars = titleSplit.chars;
        
        // Kreiraj typewriter cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        
        // Postavi cursor prije prvog karaktera
        chars[0].parentElement.insertBefore(cursor, chars[0]);
        
        // Prikaži cursor na početku typewritera i započni blinkanje
        masterTimeline.call(() => {
          cursor.style.opacity = '1';
          cursor.classList.add('active');
        }, null, 0.5);
        
        // Typewriter animacija s manualnim staggerom za pauze
        let delay = 0;
        chars.forEach((char, index) => {
          const charText = char.textContent;
          
          // Animiraj svaki karakter
          masterTimeline.to(char, {
            opacity: 1,
            duration: 0.08,
            ease: "power1.out"
          }, 0.5 + delay);
          
          // Pomakni cursor iza trenutnog karaktera (ali ne ako je to zadnji karakter)
          if (index < chars.length - 1) {
            masterTimeline.call(() => {
              chars[index + 1].parentElement.insertBefore(cursor, chars[index + 1]);
            }, null, 0.5 + delay + 0.04);
          }
          
          // Dodaj delay za sljedeći karakter
          delay += 0.04; // Brza standardna brzina
          
          // Ako je trenutni karakter zarez ili točka, dodaj ekstra pauzu
          if (charText === ',' || charText === '.') {
            delay += 0.4; // Pauza nakon interpunkcije
          }
        });
        
        // Zapamti vrijeme kad typewriter završava
        typewriterEndTime = 0.5 + delay;
        
        // Sakrij cursor prije nego što se prikaže zadnji karakter
        masterTimeline.call(() => {
          cursor.classList.remove('active');
        }, null, typewriterEndTime - 0.1);
        
        masterTimeline.to(cursor, {
          opacity: 0,
          duration: 0.1
        }, typewriterEndTime - 0.1);
      }
    }
    
    // 3. PARAGRAF - Scroll reveal line by line nakon typewritera
    let paragraphTimeline = null;
    if (paragraph) {
      // Split paragraf na riječi i linije (riječi ostaju zajedno)
      const paragraphSplit = new SplitType(paragraph, { 
        types: 'words,lines',
        tagName: 'span',
        lineClass: 'line'
      });
      splitInstances.push(paragraphSplit);
      
      if (paragraphSplit.lines && paragraphSplit.lines.length > 0) {
        const lines = paragraphSplit.lines;
        
        // Prvo prikaži cijeli paragraf (fade in) taman kad završava typewriter
        masterTimeline.to(paragraph, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, typewriterEndTime);
        
        // Prikaži prvu liniju odmah
        masterTimeline.to(lines[0], {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        }, typewriterEndTime + 0.2);
        
        // Ostale linije - scroll reveal red po red
        if (lines.length > 1) {
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const prevLine = lines[i - 1];
            
            ScrollTrigger.create({
              trigger: prevLine,
              start: "top 75%",
              onEnter: () => {
                gsap.to(line, {
                  opacity: 1,
                  duration: 0.4,
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
