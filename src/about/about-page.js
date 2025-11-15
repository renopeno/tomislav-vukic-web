function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Dohvati elemente
    const section = document.querySelector('.section.about-page');
    const title = document.querySelector('.about-page-title');
    const paragraph = document.querySelector('.about-page-paragraph');
    const image = document.querySelector('.about-page-mobile-img');
    
    // Provjeri postoje li elementi
    if (!section) return;
    
    // Kreiraj glavni timeline
    const masterTimeline = gsap.timeline({
      paused: true
    });
    
    // 1. SLIKA - Clip-path reveal (od gore prema dolje)
    if (image) {
      gsap.set(image, { clipPath: 'inset(0% 0% 100% 0%)' });
      
      masterTimeline.to(image, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        ease: "power3.inOut"
      }, 0);
    }
    
    // 2. ABOUT TITLE - Fade in (bez typewritera, samo fade)
    if (title) {
      gsap.set(title, { opacity: 0 });
      
      masterTimeline.to(title, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }, 0.6);
    }
    
    // 3. PARAGRAF - Fade in sa malim delayom
    if (paragraph) {
      gsap.set(paragraph, { opacity: 0 });
      
      masterTimeline.to(paragraph, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      }, 1.8);
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
