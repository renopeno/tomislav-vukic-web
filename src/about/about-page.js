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
          scale: 0.8,
          y: window.innerHeight / 5
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: index * 0.1, // Simulira stagger efekt
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
          }
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
  });
}

window.initAbout = initAbout;
initAbout();
