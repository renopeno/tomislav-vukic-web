// Generička funkcija za shuffle efekt
function createShuffleEffect(element, addListener = true) {
  // Spremi originalni tekst u data atribut ako već nije spremljen
  // Ovo osigurava da uvijek imamo pristup originalnom tekstu, čak i nakon više shuffleanja
  if (!element.dataset.originalText) {
    element.dataset.originalText = element.textContent;
  }
  
  const originalText = element.dataset.originalText;
  
  // Kreiraj span element koji će sadržavati tekst koji se animira
  // Ovo će omogućiti da link ostane klikabilan tijekom animacije
  let textSpan;
  
  // Provjeri je li već kreiran span za animaciju
  if (!element.querySelector('.shuffle-text')) {
    textSpan = document.createElement('span');
    textSpan.className = 'shuffle-text';
    textSpan.textContent = originalText;
    
    // Sačuvaj originalni sadržaj i zamijeni ga sa span elementom
    element.textContent = '';
    element.appendChild(textSpan);
  } else {
    textSpan = element.querySelector('.shuffle-text');
  }

  // Helper funkcija koja miješa slova u riječi koristeći Fisher-Yates shuffle algoritam
  const shuffleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  // Glavna funkcija koja pokreće shuffle animaciju
  const startEffect = () => {
    let counter = 0;
    const shuffleInterval = setInterval(() => {
      if (counter < 3) { // Izvrši shuffle 3 puta
        // Mijenjaj samo sadržaj span elementa, ne cijelog linka
        textSpan.textContent = shuffleWord(originalText);
        counter++;
      } else {
        // Vrati na originalni tekst
        textSpan.textContent = originalText;
        clearInterval(shuffleInterval);
      }
    }, 100); // Interval između svakog shufflea (100ms)
  };

  // Ako je addListener true, dodaj mouseenter event listener
  // Ovo se koristi za obične linkove, dok se za category-row linkove poziva direktno
  if (addListener) {
    element.addEventListener('mouseenter', startEffect);
  }

  // Vraćamo funkciju za pokretanje efekta
  // Ovo omogućava da se efekt može pokrenuti i programski
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

initLinksHover();