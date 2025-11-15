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
    
    // Master timeline - BEZ ScrollTrigger (pokreće se odmah na load)
    const masterTimeline = gsap.timeline();
    
    // 1. SLIKA - Clip-path reveal (odmah na load)
    if (image) {
      gsap.set(image, { clipPath: 'inset(0% 0% 100% 0%)' });
      
      masterTimeline.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: "power3.inOut"
      }, 0.2);
    }
    
    // 2. ABOUT TITLE - Line by line reveal (pred kraj fotke)
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
        
        // Počni reveal linija pred kraj fotke (oko 70% trajanja fotke = 0.84s)
        // Fotka počinje na 0.2s i traje 1.2s, znači 70% je na 1.04s od početka
        const titleStartTime = 1.0; // Počne malo pred kraj fotke
        
        lines.forEach((line, index) => {
          masterTimeline.to(line, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          }, titleStartTime + (index * 0.2)); // Stagger između linija
        });
      }
    }
    
    // 3. SVE SEKCIJE - scroll triggered (uključujući About me)
    
    // About me sekcija
    if (dividers[0]) {
      gsap.set(dividers[0], { width: 0, opacity: 0 });
      if (aboutMeTitle) gsap.set(aboutMeTitle, { opacity: 0, y: 20 });
      if (aboutMeParagraph) gsap.set(aboutMeParagraph, { opacity: 0, y: 20 });
      
      ScrollTrigger.create({
        trigger: dividers[0],
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          
          tl.to(dividers[0], {
            opacity: 1,
            width: '100%',
            duration: 0.6,
            ease: "power2.inOut"
          }, 0);
          
          if (aboutMeTitle) {
            tl.to(aboutMeTitle, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.3);
          }
          
          if (aboutMeParagraph) {
            tl.to(aboutMeParagraph, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.5);
          }
        }
      });
    }
    
    // What I photograph sekcija
    if (dividers[1]) {
      gsap.set(dividers[1], { width: 0, opacity: 0 });
      if (whatIPhotographTitle) gsap.set(whatIPhotographTitle, { opacity: 0, y: 20 });
      if (whatIPhotographContent) gsap.set(whatIPhotographContent, { opacity: 0, y: 20 });
      
      ScrollTrigger.create({
        trigger: dividers[1],
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          
          tl.to(dividers[1], {
            opacity: 1,
            width: '100%',
            duration: 0.6,
            ease: "power2.inOut"
          }, 0);
          
          if (whatIPhotographTitle) {
            tl.to(whatIPhotographTitle, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.3);
          }
          
          if (whatIPhotographContent) {
            tl.to(whatIPhotographContent, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.5);
          }
        }
      });
    }
    
    // How I work sekcija
    if (dividers[2]) {
      gsap.set(dividers[2], { width: 0, opacity: 0 });
      if (howIWorkTitle) gsap.set(howIWorkTitle, { opacity: 0, y: 20 });
      if (howIWorkParagraph) gsap.set(howIWorkParagraph, { opacity: 0, y: 20 });
      
      ScrollTrigger.create({
        trigger: dividers[2],
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          
          tl.to(dividers[2], {
            opacity: 1,
            width: '100%',
            duration: 0.6,
            ease: "power2.inOut"
          }, 0);
          
          if (howIWorkTitle) {
            tl.to(howIWorkTitle, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.3);
          }
          
          if (howIWorkParagraph) {
            tl.to(howIWorkParagraph, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.5);
          }
        }
      });
    }
    
    // Who I work with sekcija
    if (dividers[3]) {
      gsap.set(dividers[3], { width: 0, opacity: 0 });
      if (whoIWorkWithTitle) gsap.set(whoIWorkWithTitle, { opacity: 0, y: 20 });
      if (whoIWorkWithContent) gsap.set(whoIWorkWithContent, { opacity: 0, y: 20 });
      
      ScrollTrigger.create({
        trigger: dividers[3],
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          
          tl.to(dividers[3], {
            opacity: 1,
            width: '100%',
            duration: 0.6,
            ease: "power2.inOut"
          }, 0);
          
          if (whoIWorkWithTitle) {
            tl.to(whoIWorkWithTitle, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.3);
          }
          
          if (whoIWorkWithContent) {
            tl.to(whoIWorkWithContent, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.5);
          }
        }
      });
    }
    
    // Footer divider + items
    if (dividers[4]) {
      gsap.set(dividers[4], { width: 0, opacity: 0 });
      if (locationItem) gsap.set(locationItem, { opacity: 0, y: 20 });
      if (availabilityItem) gsap.set(availabilityItem, { opacity: 0, y: 20 });
      
      ScrollTrigger.create({
        trigger: dividers[4],
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          
          tl.to(dividers[4], {
            opacity: 1,
            width: '100%',
            duration: 0.6,
            ease: "power2.inOut"
          }, 0);
          
          if (locationItem) {
            tl.to(locationItem, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.3);
          }
          
          if (availabilityItem) {
            tl.to(availabilityItem, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.5);
          }
        }
      });
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
