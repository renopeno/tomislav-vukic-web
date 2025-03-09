document.addEventListener('DOMContentLoaded', function() {
  // Inicijalizacija GSAP
  gsap.registerPlugin(ScrollTrigger);
  
  // Dohvati elemente koje želimo animirati
  const section = document.querySelector('.section.about');
  const title = document.querySelector('.about-page-title');
  const paragraph = document.querySelector('.about-page-paragraph');
  const mobileImage = document.querySelector('.about-page-mobile-img');
  
  // Provjeri postoje li elementi na stranici
  if (!title && !paragraph) return;
  
  // Postavi početno stanje - sakrij elemente
  gsap.set([mobileImage, title, paragraph], { 
    opacity: 0,
    y: 50,
    scale: 0.9,
    willChange: "opacity, transform"
  });

  
  // Kreiraj timeline za animaciju
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: title,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
  
  // Dodaj animacije u timeline
  if (mobileImage) {
  tl.to(mobileImage, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
      ease: "power2.out",
    })
  }
  tl.to(title, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.1
  }, "-=0.8")
  .to(paragraph, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.8"); // Započni malo prije nego završi prethodna animacija
  
  // Dodatna provjera za mobilne uređaje
  const isMobile = window.innerWidth <= 767;
  
  if (isMobile) {
    // Prilagodbe za mobilne uređaje
    ScrollTrigger.getAll().forEach(trigger => {
      trigger.start = "top 90%"; // Promijeni trigger točku za mobilne
    });
  }
  
  // Sticky efekt za about section
  ScrollTrigger.create({
    trigger: section,
    start: "bottom bottom",
    endTrigger: ".footer",
    end: "bottom bottom",
    pinSpacing: false, // Potrebno da se footer preklapa preko about sectiona
    pin: true,
    markers: false
  });
});

