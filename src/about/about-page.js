function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Dodaj CSS za split linije (očuva originalni layout)
    const style = document.createElement('style');
    style.textContent = `
      .about-page-title .split-line,
      .about-page-paragraph .split-line {
        display: block;
        overflow: visible;
      }
      .about-page-title .split-line > *,
      .about-page-paragraph .split-line > * {
        display: inline;
      }
    `;
    document.head.appendChild(style);
    
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
    
    // Mobile image reveal
    if (mobileImage) {
      gsap.fromTo(
        mobileImage,
        { 
          opacity: 0, 
          scale: 0.95
        },
        { 
          opacity: 1, 
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Split title i paragraph po linijama
    const textElements = [title, paragraph].filter(Boolean);
    const splitInstances = [];
    
    textElements.forEach(element => {
      if (element) {
        const split = new SplitType(element, { 
          types: 'lines',
          lineClass: 'split-line',
          tagName: 'span'
        });
        splitInstances.push(split);
        
        // Animiraj svaku liniju sa stagger efektom
        gsap.to(
          split.lines,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05, // 50ms između svake linije
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      }
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
    
    // Cleanup za Barba.js transitions
    if (typeof barba !== 'undefined') {
      barba.hooks.beforeLeave(() => {
        // Revert split text
        splitInstances.forEach(split => {
          if (split && split.revert) split.revert();
        });
      });
    }
  });
}

window.initAbout = initAbout;
initAbout();
