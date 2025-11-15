function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // CSS za pravilnu strukturu i smooth reveal
    const style = document.createElement('style');
    style.textContent = `
      .about-page-title {
        overflow: visible;
      }
      
      .about-page-title .word {
        display: inline;
        white-space: normal;
        opacity: 0.1; /* Ghost text */
      }
      
      .about-page-title .word.revealed {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    // Dohvati elemente
    const section = document.querySelector('.section.about-page');
    const image = document.querySelector('.about-page-mobile-img');
    const mainTitle = document.querySelector('.about-page-title');
    const mainParagraph = document.querySelector('.about-page-paragraph');
    
    // Section titles
    const aboutMeTitle = document.querySelector('#w-node-_5cfb6280-6a33-c948-6914-d1d14a02033e-e0820647');
    const whatIPhotographTitle = document.querySelector('#w-node-_8ff28dca-4908-092a-a93e-64674276b761-e0820647');
    const howIWorkTitle = document.querySelector('#w-node-d37b0f9a-3049-7721-1f0b-b2dfa6b25604-e0820647');
    const whoIWorkWithTitle = document.querySelector('#w-node-a792f731-c023-e6a4-a3a2-3b0f75706c28-e0820647');
    
    // Paragraphs
    const aboutMeParagraph = document.querySelector('#w-node-_38752304-f930-7aec-55b4-e5bb69d7261b-e0820647');
    const whatIPhotographContent = document.querySelector('#w-node-af8686f0-0eff-8a7c-0ed7-beca4d3b4ae5-e0820647');
    const howIWorkParagraph = document.querySelector('#w-node-f5866f73-1277-b3c6-9637-905ed2896c1d-e0820647');
    const whoIWorkWithContent = document.querySelector('#w-node-_108f6310-e8be-638b-dc73-332ac7dd5576-e0820647');
    
    // Footer items
    const locationItem = document.querySelector('#w-node-_959dd736-48e6-8ca1-a499-ecdb1597fdfc-e0820647');
    const availabilityItem = document.querySelector('#w-node-_81d87156-36a4-f557-ac99-5a50eaa2aede-e0820647');
    
    // Dividers
    const dividers = document.querySelectorAll('.divider');
    
    // Provjeri postoje li elementi
    if (!section) return;
    
    // Split instance za cleanup
    const splitInstances = [];
    
    // 1. SLIKA - Clip-path reveal (odmah na load)
    if (image) {
      gsap.set(image, { clipPath: 'inset(0% 0% 100% 0%)' });
      
      // Animiraj sliku odmah
      gsap.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        ease: "power3.inOut",
        delay: 0.2
      });
    }
    
    // 2. SCROLL REVEAL za glavni title - prvih nekoliko riječi vidljivo, ostalo 0.1
    if (mainTitle) {
      // Split title na riječi - održava prirodan layout
      const titleSplit = new SplitType(mainTitle, { 
        types: 'words'
      });
      splitInstances.push(titleSplit);
      
      if (titleSplit.words && titleSplit.words.length > 0) {
        const words = titleSplit.words;
        
        // Prvih 6 riječi odmah vidljivo (opacity 1)
        const initialWordsCount = Math.min(6, words.length);
        for (let i = 0; i < initialWordsCount; i++) {
          words[i].classList.add('revealed');
        }
        
        // Scroll reveal za ostatak riječi - SAMO kad stvarno scrollaš do njih
        words.forEach((word, index) => {
          if (index < initialWordsCount) return; // Skip prve riječi
          
          ScrollTrigger.create({
            trigger: word,
            start: "top 60%",
            once: true,
            // toggleActions sprječava auto-trigger ako je već u viewportu
            toggleActions: "play none none none",
            onEnter: () => {
              gsap.to(word, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                  word.classList.add('revealed');
                }
              });
            }
          });
        });
        
        // Trigger za prve dvije sekcije kada title bude skoro cijeli reveal-an
        // Pretpostavljam da je to oko 80% reveal-a
        const triggerWordIndex = Math.floor(words.length * 0.8);
        if (words[triggerWordIndex]) {
          ScrollTrigger.create({
            trigger: words[triggerWordIndex],
            start: "top 85%",
            once: true,
            onEnter: () => {
              // Trigger prve dvije sekcije
              triggerFirstSections();
            }
          });
        }
      }
    }
    
    // Helper funkcija za divider + content reveal
    function revealSection(divider, title, content, delay = 0) {
      if (!divider) return;
      
      // Sakrij divider i content na početku
      gsap.set(divider, { width: 0, opacity: 0 });
      if (title) gsap.set(title, { opacity: 0, y: 20 });
      if (content) gsap.set(content, { opacity: 0, y: 20 });
      
      const tl = gsap.timeline({ delay });
      
      // Divider
      tl.to(divider, {
        opacity: 1,
        width: '100%',
        duration: 0.6,
        ease: "power2.inOut"
      }, 0);
      
      // Title
      if (title) {
        tl.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, 0.3);
      }
      
      // Content
      if (content) {
        tl.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, 0.5);
      }
    }
    
    // Helper funkcija za scroll triggered sekcije
    let sectionRevealed = {
      section0: false,
      section1: false,
      section2: false,
      section3: false,
      section4: false
    };
    
    function createScrollDividerSequence(divider, title, content, sectionIndex, previousSectionIndex = null) {
      if (!divider) return;
      
      // Sakrij divider i content na početku
      gsap.set(divider, { width: 0, opacity: 0 });
      if (title) gsap.set(title, { opacity: 0, y: 20 });
      if (content) gsap.set(content, { opacity: 0, y: 20 });
      
      // Scroll trigger - malo mjesta u viewport
      ScrollTrigger.create({
        trigger: divider,
        start: "top 90%", // Malo u viewport
        once: true,
        onEnter: () => {
          // Provjeri je li prethodna sekcija revealed (ako postoji)
          if (previousSectionIndex !== null && !sectionRevealed[`section${previousSectionIndex}`]) {
            // Čekaj dok se prethodna ne reveal-a
            const checkInterval = setInterval(() => {
              if (sectionRevealed[`section${previousSectionIndex}`]) {
                clearInterval(checkInterval);
                revealSection(divider, title, content, 0);
                sectionRevealed[`section${sectionIndex}`] = true;
              }
            }, 100);
          } else {
            // Reveal odmah (nema prethodne ili je već revealed)
            revealSection(divider, title, content, 0);
            sectionRevealed[`section${sectionIndex}`] = true;
          }
        }
      });
    }
    
    // Funkcija za triggeranje prvih sekcija
    let firstSectionsTriggered = false;
    function triggerFirstSections() {
      if (firstSectionsTriggered) return;
      firstSectionsTriggered = true;
      
      // Prva sekcija (About me) - odmah
      if (dividers[0]) {
        revealSection(dividers[0], aboutMeTitle, aboutMeParagraph, 0);
        sectionRevealed.section0 = true;
      }
      
      // Druga sekcija (What I photograph) - sa delayom ako je u viewportu
      if (dividers[1]) {
        const secondSectionRect = dividers[1].getBoundingClientRect();
        if (secondSectionRect.top < window.innerHeight) {
          // U viewportu je, triggeruj sa delayem
          revealSection(dividers[1], whatIPhotographTitle, whatIPhotographContent, 0.6);
          setTimeout(() => {
            sectionRevealed.section1 = true;
          }, 600);
        } else {
          // Nije u viewportu, postavi scroll trigger
          createScrollDividerSequence(dividers[1], whatIPhotographTitle, whatIPhotographContent, 1, 0);
        }
      }
    }
    
    // 3. OSTALE SEKCIJE - scroll triggered sa dependency na prethodnu
    // How I work (čeka What I photograph)
    if (dividers[2]) {
      createScrollDividerSequence(
        dividers[2], 
        howIWorkTitle, 
        howIWorkParagraph,
        2,
        1
      );
    }
    
    // Who I work with (čeka How I work)
    if (dividers[3]) {
      createScrollDividerSequence(
        dividers[3], 
        whoIWorkWithTitle, 
        whoIWorkWithContent,
        3,
        2
      );
    }
    
    // Footer divider + items (čeka Who I work with)
    if (dividers[4]) {
      createScrollDividerSequence(
        dividers[4], 
        locationItem, 
        availabilityItem,
        4,
        3
      );
    }
    
    
    // Sticky efekt za about section sa dodatnim spacingom
    ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      endTrigger: ".footer",
      end: "top bottom-=200", // Dodaj 200px spacing prije footera
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
