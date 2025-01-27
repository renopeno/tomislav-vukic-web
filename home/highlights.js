function initHomeHighlights() {
  const highlightsSection = document.querySelector('.section.highlights');
  const highlightsWrapper = document.querySelector('.highlights-wrapper');

  // Ukupna širina wrappera minus širina viewporta
  const totalWidth = highlightsWrapper.scrollWidth - highlightsSection.offsetWidth;

  // GSAP animacija - Horizontalno scrollanje Highlights
  gsap.to(highlightsWrapper, {
      x: -totalWidth, // Horizontalno skrolaj
      ease: "linear", // Dodaj easing za glatkiji prijelaz
      duration: 0.5, // Brzina scrollanja
      scrollTrigger: {
          trigger: highlightsSection, // Sekcija koja pokreće animaciju
          start: 'top top', // Početak na vrhu viewporta
          end: `+=${highlightsWrapper.scrollWidth}`, // Dodaj cijelu širinu wrappera kao dužinu animacije
          scrub: true, // Sync s korisničkim skrolom
          pin: true, // Fiksiraj dok traje animacija
          anticipatePin: 0, // Spriječava trzanje
      },
  });
}