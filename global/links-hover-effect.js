// Generička funkcija za shuffle efekt
function createShuffleEffect(element, addListener = true) {
  const originalText = element.textContent;

  const shuffleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const startEffect = () => {
    let currentText = originalText;
    let counter = 0;

    const shuffleInterval = setInterval(() => {
      if (counter < 3) {
        currentText = shuffleWord(originalText);
        element.textContent = currentText;
        counter++;
      } else {
        element.textContent = originalText;
        clearInterval(shuffleInterval);
      }
    }, 100);
  };

  if (addListener) {
    element.addEventListener('mouseenter', startEffect);
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

initLinksHover();