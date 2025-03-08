document.addEventListener('DOMContentLoaded', function() {
  // Inicijalizacija GSAP
  gsap.registerPlugin(ScrollTrigger);
  
  // Dohvati elemente koje želimo animirati
  const title = document.querySelector('.about-page-title');
  const paragraph = document.querySelector('.about-page-paragraph');
  
  // Provjeri postoje li elementi na stranici
  if (!title && !paragraph) return;
  
  // Postavi početno stanje - sakrij elemente
  gsap.set([title, paragraph], { 
    opacity: 0,
    y: 50,
    scale: 0.9
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
  tl.to(title, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.1
  })
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
});


function initAboutPin() {
  const section = document.querySelector('.section.about');
  const footer = document.querySelector('footer') || document.querySelector('.footer');
  
  if (!section || !footer) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    endTrigger: footer,
    end: "top bottom",
    pin: true,
  });
  
}

initAboutPin();