// Generička funkcija za shuffle efekt
function createShuffleEffect(element, addListener = true) {
  const originalText = element.textContent;
  let currentInterval = null;

  const shuffleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const startEffect = () => {
    // Očisti prethodni interval ako postoji
    if (currentInterval) {
      clearInterval(currentInterval);
      element.textContent = originalText;
    }

    let counter = 0;

    currentInterval = setInterval(() => {
      if (counter < 3) {
        element.textContent = shuffleWord(originalText);
        counter++;
      } else {
        element.textContent = originalText;
        clearInterval(currentInterval);
        currentInterval = null;
      }
    }, 100);
  };

  const stopEffect = () => {
    if (currentInterval) {
      clearInterval(currentInterval);
      currentInterval = null;
    }
    element.textContent = originalText;
  };

  if (addListener) {
    element.addEventListener('mouseenter', startEffect);
    element.addEventListener('mouseleave', stopEffect);
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