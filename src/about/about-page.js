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
        margin: 0;
        padding: 0;
      }
      
      .about-page-title .char {
        display: inline !important;
        opacity: 0;
        margin: 0;
        padding: 0;
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
        width: 3px;
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
      
      /* Paragraf riječi wrap i opacity */
      .about-page-paragraph .word {
        display: inline-block !important;
        white-space: nowrap;
        opacity: 0.1;
        margin: 0;
        padding: 0;
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
        
        // Typewriter animacija s manualnim staggerom za pauze
        let delay = 0;
        chars.forEach((char, index) => {
          const charText = char.textContent;
          
          // Prikaži cursor skupa sa prvim karakterom
          if (index === 0) {
            masterTimeline.call(() => {
              cursor.style.opacity = '1';
              cursor.classList.add('active');
            }, null, 0.5 + delay);
          }
          
          // Animiraj svaki karakter (sporije i smootherije)
          masterTimeline.to(char, {
            opacity: 1,
            duration: 0.12,
            ease: "power2.out"
          }, 0.5 + delay);
          
          // Pomakni cursor iza trenutnog karaktera (ali ne ako je to zadnji karakter)
          if (index < chars.length - 1) {
            masterTimeline.call(() => {
              chars[index + 1].parentElement.insertBefore(cursor, chars[index + 1]);
            }, null, 0.5 + delay + 0.06);
          }
          
          // Dodaj delay za sljedeći karakter (sporije)
          delay += 0.06;
          
          // Ako je trenutni karakter zarez ili točka, dodaj ekstra pauzu
          if (charText === ',' || charText === '.') {
            delay += 0.5; // Duža pauza nakon interpunkcije
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
    
    // 3. PARAGRAF - Word by word reveal nakon typewritera
    let paragraphTimeline = null;
    if (paragraph) {
      // Split paragraf na riječi (riječi ostaju zajedno)
      const paragraphSplit = new SplitType(paragraph, { 
        types: 'words',
        tagName: 'span'
      });
      splitInstances.push(paragraphSplit);
      
      if (paragraphSplit.words && paragraphSplit.words.length > 0) {
        const words = paragraphSplit.words;
        
        // Prvo prikaži cijeli paragraf (fade in) ranije - odmah nakon što typewriter započne sa zadnjim redom
        masterTimeline.to(paragraph, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, typewriterEndTime - 1.0); // Pojavljuje se 1s prije kraja typewritera
        
        // Prikaži prvu riječ odmah nakon fade-in
        masterTimeline.to(words[0], {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, typewriterEndTime - 0.8);
        
        // Ostale riječi - scroll reveal word by word
        if (words.length > 1) {
          // Grupiraj po ~ 3-4 riječi za smootheriji efekt
          const wordsPerGroup = 3;
          
          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const prevWord = words[i - 1];
            
            ScrollTrigger.create({
              trigger: prevWord,
              start: "top 80%",
              onEnter: () => {
                gsap.to(word, {
                  opacity: 1,
                  duration: 0.35,
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
