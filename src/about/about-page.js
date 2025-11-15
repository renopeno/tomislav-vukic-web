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
      
      .about-page-title .line {
        display: block;
        overflow: visible;
      }
      
      .about-page-title .word {
        display: inline;
        white-space: normal;
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
    
    // Kreiraj glavni timeline
    const masterTimeline = gsap.timeline({ paused: true });
    
    // 1. SLIKA - Clip-path reveal
    if (image) {
      gsap.set(image, { clipPath: 'inset(0% 0% 100% 0%)' });
      masterTimeline.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        ease: "power3.inOut"
      }, 0);
    }
    
    // 2. LINE BY LINE REVEAL za glavni title
    let titleEndTime = 0;
    if (mainTitle) {
      // Split title na linije - održava prirodan layout
      const titleSplit = new SplitType(mainTitle, { 
        types: 'lines',
        lineClass: 'line'
      });
      splitInstances.push(titleSplit);
      
      if (titleSplit.lines && titleSplit.lines.length > 0) {
        const lines = titleSplit.lines;
        
        // Sakrij sve linije na početku
        gsap.set(lines, { autoAlpha: 0, y: 20 });
        
        // Smooth reveal linija po linija
        masterTimeline.to(lines, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15, // 150ms između svake linije
          ease: "power2.out"
        }, 0.6);
        
        // Izračunaj vrijeme završetka
        const totalDuration = 0.6 + (lines.length * 0.15) + 0.8;
        // Ali prvi divider počinje malo prije kraja
        titleEndTime = totalDuration - 0.5; // Divider počinje 0.5s prije kraja title-a
      }
    }
    
    // Helper funkcija za divider + content reveal (za master timeline)
    function createDividerSequence(divider, title, content, startTime) {
      if (!divider) return startTime;
      
      // Sakrij divider i content na početku
      gsap.set(divider, { width: 0, opacity: 0 });
      if (title) gsap.set(title, { opacity: 0, y: 20 });
      if (content) gsap.set(content, { opacity: 0, y: 20 });
      
      // Divider animacija (fade in + width)
      masterTimeline.to(divider, {
        opacity: 1,
        width: '100%',
        duration: 0.6,
        ease: "power2.inOut"
      }, startTime);
      
      // Title fade in
      if (title) {
        masterTimeline.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, startTime + 0.3);
      }
      
      // Content fade in
      if (content) {
        masterTimeline.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, startTime + 0.5);
      }
      
      return startTime + 1.2;
    }
    
    // Helper funkcija za scroll triggered divider + content
    function createScrollDividerSequence(divider, title, content) {
      if (!divider) return;
      
      // Sakrij divider i content na početku
      gsap.set(divider, { width: 0, opacity: 0 });
      if (title) gsap.set(title, { opacity: 0, y: 20 });
      if (content) gsap.set(content, { opacity: 0, y: 20 });
      
      // Scroll trigger za divider
      ScrollTrigger.create({
        trigger: divider,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          
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
      });
    }
    
    // 3. PRVA SEKCIJA (About me) - animira se nakon title-a
    if (dividers[0]) {
      createDividerSequence(
        dividers[0], 
        aboutMeTitle, 
        aboutMeParagraph, 
        titleEndTime + 0.3
      );
    }
    
    // 4. OSTALE SEKCIJE - scroll triggered
    // What I photograph
    if (dividers[1]) {
      createScrollDividerSequence(
        dividers[1], 
        whatIPhotographTitle, 
        whatIPhotographContent
      );
    }
    
    // How I work
    if (dividers[2]) {
      createScrollDividerSequence(
        dividers[2], 
        howIWorkTitle, 
        howIWorkParagraph
      );
    }
    
    // Who I work with
    if (dividers[3]) {
      createScrollDividerSequence(
        dividers[3], 
        whoIWorkWithTitle, 
        whoIWorkWithContent
      );
    }
    
    // Footer divider + items
    if (dividers[4]) {
      createScrollDividerSequence(
        dividers[4], 
        locationItem, 
        availabilityItem
      );
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
