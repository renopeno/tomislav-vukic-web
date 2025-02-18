function initLinksHover() {
  // Selektiraj sve linkove i kategorije
  document.querySelectorAll('.link, .cta, .categories-row').forEach(element => {
    const originalText = element.textContent;

    const shuffleWord = (word) => {
      const letters = word.split('');
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      return letters.join('');
    };

    element.addEventListener('mouseenter', () => {
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
    });

    // Nema potrebe za dodatnim resetiranjem teksta na mouseleave
  });
}

initLinksHover();