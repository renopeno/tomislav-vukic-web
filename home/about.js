document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded event pokrenut");
  
  // Pričekaj malo da se sve skripte učitaju
  setTimeout(function() {
    initAboutSection();
  }, 500);
});

function initAboutSection() {
  console.log("initAboutSection pokrenut");
  
  // Provjeri je li GSAP dostupan
  if (typeof gsap === 'undefined') {
    console.error("GSAP nije dostupan!");
    return;
  }
  
  // Provjeri je li ScrollTrigger dostupan
  if (typeof ScrollTrigger === 'undefined') {
    console.error("ScrollTrigger nije dostupan!");
    return;
  }
  
  console.log("GSAP i ScrollTrigger su dostupni");
  
  // Dohvati elemente
  const aboutTitle = document.querySelector('.about-title');
  const aboutParagraph = document.querySelector('.about-paragraph');
  const aboutScroll = document.querySelector('.about-scroll');
  
  if (!aboutTitle || !aboutParagraph || !aboutScroll) {
    console.error("Neki od elemenata nisu pronađeni!");
    return;
  }
  
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
    stagger: 0.02,
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
  
  console.log("ScrollTriggeri kreirani za About sekciju");
}

// Dodatno osvježi ScrollTrigger nakon učitavanja stranice
window.addEventListener('load', function() {
  console.log("Window load event");
  setTimeout(function() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
      console.log("ScrollTrigger osvježen nakon učitavanja stranice");
    }
  }, 1000);
});

// Inicijaliziraj sekciju nakon učitavanja DOM-a
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}