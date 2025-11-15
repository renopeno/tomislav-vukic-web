function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
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
    
    // 2. TYPEWRITER EFEKT za glavni title (bez SplitType)
    if (mainTitle) {
      const titleText = mainTitle.textContent;
      const titleHTML = mainTitle.innerHTML;
      
      // Wrap text u span sa overflow hidden
      mainTitle.innerHTML = `<span class="typewriter-wrapper" style="display: inline-block; overflow: hidden; max-width: 0;"><span class="typewriter-text" style="white-space: nowrap;">${titleHTML}</span></span>`;
      
      const wrapper = mainTitle.querySelector('.typewriter-wrapper');
      
      // Typewriter animacija -ширимо wrapper
      masterTimeline.to(wrapper, {
        maxWidth: '100%',
        duration: 3,
        ease: "none"
      }, 0.6);
    }
    
    // Helper funkcija za divider + content reveal
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
      
      return startTime + 1.2; // Return next start time
    }
    
    // 3. SEKCIJE sa dividerima
    let currentTime = 4.0; // Počinje nakon typewritera
    
    // About me
    if (dividers[0]) {
      currentTime = createDividerSequence(
        dividers[0], 
        aboutMeTitle, 
        aboutMeParagraph, 
        currentTime
      );
    }
    
    // What I photograph
    if (dividers[1]) {
      currentTime = createDividerSequence(
        dividers[1], 
        whatIPhotographTitle, 
        whatIPhotographContent, 
        currentTime
      );
    }
    
    // How I work
    if (dividers[2]) {
      currentTime = createDividerSequence(
        dividers[2], 
        howIWorkTitle, 
        howIWorkParagraph, 
        currentTime
      );
    }
    
    // Who I work with
    if (dividers[3]) {
      currentTime = createDividerSequence(
        dividers[3], 
        whoIWorkWithTitle, 
        whoIWorkWithContent, 
        currentTime
      );
    }
    
    // Footer divider + items
    if (dividers[4]) {
      currentTime = createDividerSequence(
        dividers[4], 
        locationItem, 
        availabilityItem, 
        currentTime
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
        // Clear timeline
        if (masterTimeline) masterTimeline.kill();
        // Clear ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      });
    }
  });
}

window.initAbout = initAbout;
initAbout();
