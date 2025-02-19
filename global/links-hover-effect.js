// Generička funkcija za shuffle efekt
function createShuffleEffect(element, addListener = true) {
  // Spremi originalni tekst u data atribut ako već nije spremljen
  // Ovo osigurava da uvijek imamo pristup originalnom tekstu, čak i nakon više shuffleanja
  if (!element.dataset.originalText) {
    element.dataset.originalText = element.textContent;
  }
  
  const originalText = element.dataset.originalText;

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
        element.textContent = shuffleWord(originalText);
        counter++;
      } else {
        element.textContent = originalText; // Vrati na originalni tekst
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