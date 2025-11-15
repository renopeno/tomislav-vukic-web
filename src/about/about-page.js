function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Dohvati elemente koje želimo animirati
    const section = document.querySelector('.section.about-page');
    const title = document.querySelector('.about-page-title');
    const paragraph = document.querySelector('.about-page-paragraph');
    const mobileImage = document.querySelector('.about-page-mobile-img');
    
    // Provjeri postoje li elementi na stranici
    if (!title && !paragraph) return;
    
    // Kreiraj timeline za animaciju
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
        markers: false
      }
    });
    
    // Elementi koje animiramo
    const elements = [mobileImage, title, paragraph].filter(Boolean);
    
    // Koristi fromTo animaciju koja je konzistentna s grid.js
    elements.forEach((element, index) => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          y: 40 // Manji y offset da se ne preklapaju
        },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: index * 0.15, // Veći stagger za bolju separaciju
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          clearProps: "transform" // Očisti transform nakon animacije
        }
      );
    });
    
    // Dodatna provjera za mobilne uređaje
    const isMobile = window.innerWidth <= 767;
    
    if (isMobile) {
      // Prilagodbe za mobilne uređaje
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.start = "top 90%";
      });
    }
    
    // Sticky efekt za about section s fade out dok footer dolazi
    ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      endTrigger: ".footer",
      end: "bottom bottom",
      pinSpacing: false, // Vrati false da footer prelazi preko
      pin: true,
      markers: false,
      anticipatePin: 1, // Sprječava layout shift
      onUpdate: (self) => {
        // Fade out about sadržaj dok footer dolazi (progress 0 = vidljivo, 1 = nevidljivo)
        const opacity = 1 - self.progress;
        if (section) {
          section.style.opacity = opacity;
        }
      },
      onRefresh: () => {
        // Force proper layout calculation nakon refresh
        ScrollTrigger.refresh();
      }
    });
  });
}

window.initAbout = initAbout;
initAbout();
