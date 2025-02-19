// Generička funkcija za shuffle efekt
function createShuffleEffect(element, addListener = true) {
  console.log('🎯 Creating effect for:', {
    element: element.textContent,
    addListener,
    originalText: element.textContent
  });

  // Spremi originalni tekst u data atribut ako već nije spremljen
  if (!element.dataset.originalText) {
    element.dataset.originalText = element.textContent;
  }
  
  const originalText = element.dataset.originalText;

  const shuffleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const startEffect = () => {
    console.log('🔄 Starting effect:', {
      currentText: element.textContent,
      originalText,
      addListener
    });

    let counter = 0;
    const shuffleInterval = setInterval(() => {
      console.log('📝 Shuffle iteration:', {
        counter,
        currentText: element.textContent,
        originalText
      });

      if (counter < 3) {
        element.textContent = shuffleWord(originalText);
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