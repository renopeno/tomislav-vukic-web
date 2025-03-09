// Generička funkcija za shuffle efekt
function createShuffleEffect(element, addListener = true) {
  // Spremi originalni tekst u data atribut ako već nije spremljen
  if (!element.dataset.originalText) {
    element.dataset.originalText = element.textContent;
  }
  
  const originalText = element.dataset.originalText;
  
  // Osiguraj da link ima visoki z-index i da je klikabilan
  element.style.position = 'relative';
  element.style.zIndex = '100000';
  
  // Ako već postoji span za shuffle, koristi ga, inače kreiraj novi
  let textSpan;
  if (element.querySelector('.shuffle-text')) {
    textSpan = element.querySelector('.shuffle-text');
  } else {
    // Kreiraj span element koji će sadržavati tekst koji se animira
    textSpan = document.createElement('span');
    textSpan.className = 'shuffle-text';
    textSpan.textContent = originalText;
    
    // Sačuvaj originalni sadržaj i zamijeni ga sa span elementom
    element.textContent = '';
    element.appendChild(textSpan);
  }
  
  // Osiguraj da span ne blokira klikove
  textSpan.style.pointerEvents = 'none';
  
  // Varijabla za praćenje stanja animacije
  let isAnimating = false;
  let shuffleInterval;

  // Helper funkcija koja miješa slova u riječi
  const shuffleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  // Funkcija za zaustavljanje animacije
  const stopAnimation = () => {
    if (shuffleInterval) {
      clearInterval(shuffleInterval);
      shuffleInterval = null;
    }
    textSpan.textContent = originalText;
    isAnimating = false;
  };

  // Glavna funkcija koja pokreće shuffle animaciju
  const startEffect = () => {
    // Ne pokreći animaciju na dodirnim uređajima
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }
    
    // Ako je animacija već u tijeku, ne pokreći novu
    if (isAnimating) return;
    
    isAnimating = true;
    let counter = 0;
    
    // Zaustavi prethodnu animaciju ako postoji
    if (shuffleInterval) {
      clearInterval(shuffleInterval);
    }
    
    shuffleInterval = setInterval(() => {
      if (counter < 3) { // Izvrši shuffle 3 puta
        textSpan.textContent = shuffleWord(originalText);
        counter++;
      } else {
        textSpan.textContent = originalText; // Vrati na originalni tekst
        clearInterval(shuffleInterval);
        shuffleInterval = null;
        isAnimating = false;
      }
    }, 100); // Interval između svakog shufflea (100ms)
  };

  // Dodaj event listenere
  if (addListener) {
    // Provjeri je li uređaj dodirni
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      // Mouseenter za pokretanje efekta samo na ne-dodirnim uređajima
      element.addEventListener('mouseenter', startEffect);
    }
    
    // Click za zaustavljanje animacije i osiguravanje da link radi
    element.addEventListener('click', function(e) {
      // Zaustavi animaciju ako je u tijeku
      stopAnimation();
      
      // Ne sprječavaj defaultnu akciju - link će raditi normalno
    });
  }

  // Vraćamo funkciju za pokretanje efekta
  return startEffect;
}

// Inicijalizacija za osnovne elemente
function initLinksHover() {
  document.querySelectorAll('.link, .cta').forEach(element => {
    createShuffleEffect(element, true);
  });
}

// Exportaj funkciju da je možeš koristiti u drugim fileovima
window.createShuffleEffect = createShuffleEffect;

// Inicijaliziraj efekt na linkovima
initLinksHover();