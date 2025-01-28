function initAbout() {
  // Provjeri je li GSAP dostupan
  if (typeof gsap === 'undefined') {
    console.warn('GSAP nije učitan');
    return;
  }

  const aboutSection = document.querySelector('.section.about-me');
  if (!aboutSection) {
    console.warn('About sekcija nije pronađena');
    return;
  }

  // Očisti postojeće animacije
  gsap.killTweensOf(".about *");
  if (ScrollTrigger) {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  // Jednostavna timeline animacija
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
      duration: 0.8
    }
  });

  // Animiraj elemente jedan po jedan
  tl.from('.about .body:first-child', {
    opacity: 0,
    y: 50
  })
  .from('.about-title', {
    opacity: 0,
    y: 30
  }, "-=0.4")
  .from('.about .body:not(:first-child)', {
    opacity: 0,
    y: 50,
    stagger: 0.2
  }, "-=0.4");
}
