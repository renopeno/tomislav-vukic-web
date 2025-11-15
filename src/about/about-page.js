function initAbout() {
  document.addEventListener('DOMContentLoaded', function() {
    // Inicijalizacija GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // CSS za reveal linije (očuva layout)
    const style = document.createElement('style');
    style.textContent = `
      .reveal-line {
        display: block;
        transition: opacity 0.4s ease;
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
    
    // Mobile image - jednostavna fade-in animacija
    if (mobileImage) {
      gsap.fromTo(
        mobileImage,
        { opacity: 0, scale: 0.95 },
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
    
    // Split tekst na linije za line-by-line reveal
    const textElements = [title, paragraph].filter(Boolean);
    const splitInstances = [];
    let previousEndTrigger = null;
    
    textElements.forEach((element, elementIndex) => {
      if (element) {
        // Split na linije
        const split = new SplitType(element, { 
          types: 'lines',
          lineClass: 'reveal-line'
        });
        splitInstances.push(split);
        
        if (split.lines && split.lines.length > 0) {
          // Postavi svi redovi na opacity 0.1
          gsap.set(split.lines, { opacity: 0.1 });
          
          // Prvi red odmah na opacity 1
          gsap.set(split.lines[0], { opacity: 1 });
          
          // Scroll-triggered reveal za ostale linije
          split.lines.forEach((line, lineIndex) => {
            if (lineIndex === 0) return; // Skip prvi red (već vidljiv)
            
            // Svaka linija ima svoj ScrollTrigger
            const trigger = elementIndex === 0 && lineIndex === 1 
              ? section // Prvi element koristi section kao trigger
              : split.lines[lineIndex - 1]; // Ostali koriste prethodnu liniju
            
            ScrollTrigger.create({
              trigger: trigger,
              start: elementIndex === 0 && lineIndex === 1 ? "top 70%" : "top 85%",
              onEnter: () => {
                gsap.to(line, {
                  opacity: 1,
                  duration: 0.4,
                  ease: "power2.out"
                });
              },
              once: true // Play only once, ne vraća se natrag
            });
          });
          
          // Zapamti zadnju liniju ovog elementa za chain
          previousEndTrigger = split.lines[split.lines.length - 1];
        }
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
