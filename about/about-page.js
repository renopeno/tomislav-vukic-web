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

function initAboutPage() {
  // Dohvati about sekciju i footer
  const aboutSection = document.querySelector('.section.about');
  const footer = document.querySelector('footer') || document.querySelector('.footer');
  
  // Provjeri postoje li potrebni elementi
  if (!aboutSection || !footer) return;
  
  // Kreiraj pin za about sekciju
  ScrollTrigger.create({
    trigger: aboutSection,
    start: "top top", // počni kad vrh sekcije dotakne vrh viewporta
    endTrigger: footer, // koristi footer kao trigger za kraj
    end: "top bottom", // završi kad vrh footera dotakne dno viewporta
    pin: true,
    pinSpacing: false, // ključno za efekt "prelaska preko"
    anticipatePin: 1,
    markers: false, // postavi na true za debug
    id: "about-section-pin"
  });
  
//   // Osvježi ScrollTrigger kada se prozor promijeni
//   window.addEventListener('resize', () => {
//     ScrollTrigger.refresh();
//   });
}

initAboutPage();