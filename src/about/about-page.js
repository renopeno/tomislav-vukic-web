function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // CSS za pravilnu strukturu
    const style = document.createElement('style');
    style.textContent = `
      .about-page-title {
        overflow: visible;
      }
      
      .about-page-title .line {
        display: block;
        opacity: 0;
      }
      
      .about-margin-footer {
        height: 80vh;
        min-height: 600px;
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
    const whoIWorkWithContent = document.querySelector('#w-node-_26bcf290-3970-d3ae-4c5a-8a87562b3b8f-e0820647'); // Ažuriran ID
    
    // Footer items
    const locationItem = document.querySelector('#w-node-_959dd736-48e6-8ca1-a499-ecdb1597fdfc-e0820647');
    const availabilityItem = document.querySelector('#w-node-_81d87156-36a4-f557-ac99-5a50eaa2aede-e0820647');
    
    // Dividers
    const dividers = document.querySelectorAll('.divider');
    
    // Provjeri postoje li elementi
    if (!section) return;
    
    // Split instance za cleanup
    const splitInstances = [];
    
    // Flag za praćenje je li title završio
    let titleRevealed = false;
    
    // Master timeline - BEZ ScrollTrigger (pokreće se odmah na load)
    const masterTimeline = gsap.timeline();
    
    // 1. SLIKA - Clip-path reveal (odmah na load)
    if (image) {
      gsap.set(image, { clipPath: 'inset(0% 0% 100% 0%)' });
      
      masterTimeline.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: "expo.inOut" // Jači, dinamičniji ease
      }, 0.2);
    }
    
    // 2. ABOUT TITLE - Line by line reveal
    let titleEndTime = 0;
    let titleStartTime = 0.8; // Kasnije (0.6 -> 0.8)
    let firstSectionStartTime = 0;
    
    if (mainTitle) {
      // Split title na linije
      const titleSplit = new SplitType(mainTitle, { 
        types: 'lines'
      });
      splitInstances.push(titleSplit);
      
      if (titleSplit.lines && titleSplit.lines.length > 0) {
        const lines = titleSplit.lines;
        
        // Početna pozicija (sve linije skrivene)
        gsap.set(lines, { opacity: 0, y: 20 });
        
        lines.forEach((line, index) => {
          masterTimeline.to(line, {
            opacity: 1,
            y: 0,
            duration: 0.4, // Smanjeno (0.5 -> 0.4)
            ease: "power2.out"
          }, titleStartTime + (index * 0.15));
        });
        
        // Izračunaj kada zadnja linija završava
        titleEndTime = titleStartTime + ((lines.length - 1) * 0.15) + 0.4; // Ažurirano
        
        // Izračunaj 70% title reveala - tu počinje prva sekcija (ranije: 90% -> 70%)
        const titleDuration = titleEndTime - titleStartTime;
        firstSectionStartTime = titleStartTime + (titleDuration * 0.7) - 0.15; // 0.15s ranije
        
        // Postavi flag kada title završi
        masterTimeline.call(() => {
          titleRevealed = true;
        }, null, titleEndTime);
      }
    }
    
    // 3. GENERIČKA LOGIKA ZA SVE SEKCIJE
    
    // Definiraj sve sekcije
    const sections = [
      { divider: dividers[0], title: aboutMeTitle, content: aboutMeParagraph },
      { divider: dividers[1], title: whatIPhotographTitle, content: whatIPhotographContent },
      { divider: dividers[2], title: howIWorkTitle, content: howIWorkParagraph },
      { divider: dividers[3], title: whoIWorkWithTitle, content: whoIWorkWithContent },
      { divider: dividers[4], title: locationItem, content: availabilityItem }
    ];
    
    // Praćenje timinga sekcija
    let currentSectionStartTime = firstSectionStartTime;
    
    sections.forEach((section, index) => {
      if (!section.divider) return;
      
      // Postavi početne vrijednosti
      gsap.set(section.divider, { width: 0, opacity: 0 });
      if (section.title) gsap.set(section.title, { opacity: 0, y: 20 });
      if (section.content) gsap.set(section.content, { opacity: 0, y: 20 });
      
      // Provjeri je li sekcija u viewportu
      const rect = section.divider.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight;
      
      if (isInViewport) {
        // SEKCIJA JE U VIEWPORTU - dodaj u master timeline
        
        // Divider
        masterTimeline.to(section.divider, {
          opacity: 1,
          width: '100%',
          duration: 0.6,
          ease: "power2.inOut"
        }, currentSectionStartTime);
        
        // Title
        if (section.title) {
          masterTimeline.to(section.title, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          }, currentSectionStartTime + 0.15);
        }
        
        // Content
        if (section.content) {
          masterTimeline.to(section.content, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          }, currentSectionStartTime + 0.25);
        }
        
        // Izračunaj kad ova sekcija završava
        const sectionEndTime = currentSectionStartTime + 0.25 + 0.6;
        // Sljedeća sekcija kreće na 70% ove
        const sectionDuration = sectionEndTime - currentSectionStartTime;
        currentSectionStartTime = currentSectionStartTime + (sectionDuration * 0.7);
        
      } else {
        // SEKCIJA NIJE U VIEWPORTU - dodaj ScrollTrigger
        
        ScrollTrigger.create({
          trigger: section.divider,
          start: "top 92%", // Ranije (85% -> 92%)
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            
            tl.to(section.divider, {
              opacity: 1,
              width: '100%',
              duration: 0.6,
              ease: "power2.inOut"
            }, 0);
            
            if (section.title) {
              tl.to(section.title, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
              }, 0.15);
            }
            
            if (section.content) {
              tl.to(section.content, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
              }, 0.25);
            }
          }
        });
      }
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
