document.addEventListener('DOMContentLoaded', function() {
  
  function initAboutSection() {
    // Dohvati elemente
    const aboutTitle = document.querySelector('.about-title');
    const aboutParagraph = document.querySelector('.about-paragraph');
    const aboutScroll = document.querySelector('.about-scroll');
    
    // Umjesto SplitType, koristit ćemo vlastitu funkciju za omotavanje slova
    function wrapCharsInSpans(element) {
      const text = element.textContent;
      let html = '';
      
      // Omotaj svaki znak u span, ali zadrži razmake kao obične znakove
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          html += ' ';
        } else if (text[i] === '\n') {
          html += '<br>';
        } else {
          html += `<span class="char" style="opacity: 0;">${text[i]}</span>`;
        }
      }
      
      element.innerHTML = html;
      return element.querySelectorAll('.char');
    }
    
    // Posebna funkcija za scroll tekst koja zadržava razmake
    function wrapCharsInSpansWithSpaces(element) {
      const text = element.textContent;
      let html = '';
      
      // Omotaj svaki znak u span, uključujući razmake
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          html += '<span class="char space" style="opacity: 0;">&nbsp;</span>';
        } else if (text[i] === '\n') {
          html += '<br>';
        } else {
          html += `<span class="char" style="opacity: 0;">${text[i]}</span>`;
        }
      }
      
      element.innerHTML = html;
      return element.querySelectorAll('.char');
    }
    
    // Omotaj znakove u spanove
    const titleChars = wrapCharsInSpans(aboutTitle);
    const paragraphChars = wrapCharsInSpans(aboutParagraph);
    const scrollChars = wrapCharsInSpansWithSpaces(aboutScroll);
    
    // Kreiraj timeline za naslov
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-reveal-start',
        endTrigger: '.about-reveal-end',
        start: "top 70%",
        end: "top bottom",
        scrub: 0.5
      }
    });
    
    // Animiraj naslov
    titleTl.to(titleChars, {
      opacity: 1,
      stagger: 0.015,
      ease: "power2.out"
    });
    
    // Kreiraj timeline za paragraf
    const paragraphTl = gsap.timeline({
      scrollTrigger: {
          trigger: '.about-title',
          endTrigger: '.about-reveal-end',
          start: "center 60%",
          end: "top 40%",
          scrub: 0.5,
          markers: false
      }
    });
    
    // Animiraj paragraf
    paragraphTl.to(paragraphChars, {
      opacity: 1,
      stagger: 0.01,
      ease: "power2.out"
    });
    
    // Kreiraj timeline za scroll tekst
    const scrollTl = gsap.timeline({
      scrollTrigger: {
          trigger: '.about-paragraph',
          endTrigger: '.about-reveal-end',
          start: "center 70%",
          end: "top 40%",
          scrub: 0.5,
          markers: false
      }
    });
    
    // Animiraj scroll tekst
    scrollTl.to(scrollChars, {
      opacity: 1,
      stagger: 0.015,
      ease: "power2.out"
    });
  }
  
  initAboutSection();
}
// // Dodatno osvježi ScrollTrigger nakon učitavanja stranice
// window.addEventListener('load', function() {
//   setTimeout(function() {
//     if (typeof ScrollTrigger !== 'undefined') {
//       ScrollTrigger.refresh();
//     }
//   }, 1000);
// });

// // Inicijaliziraj sekciju nakon učitavanja DOM-a
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', initAboutSection);
// } else {
//   initAboutSection();
// }

