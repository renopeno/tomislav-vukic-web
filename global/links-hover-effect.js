function initLinksHover() {
  document.querySelectorAll('.link').forEach(link => {
    const originalText = link.textContent;

    // Provjeri je li element cta
    const isCta = link.classList.contains('cta');

    const shuffleWord = (word) => {
      const letters = word.split('');
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      return letters.join('');
    };

    link.addEventListener('mouseenter', () => {
      if (isCta) {
        // Hover na CTA linkove - drugačiji efekt ako je potrebno
        link.style.textDecoration = 'underline'; // Primjer dodatnog hover efekta
        return;
      }

      let currentText = originalText;
      let counter = 0;

      const shuffleInterval = setInterval(() => {
        if (counter < 3) {
          currentText = shuffleWord(originalText);
          link.textContent = currentText;
          counter++;
        } else {
          link.textContent = originalText;
          clearInterval(shuffleInterval);
        }
      }, 100);
    });

    link.addEventListener('mouseleave', () => {
      if (isCta) {
        link.style.textDecoration = 'none'; // Ukloni dodatni hover efekt
      }
    });
  });
}

initLinksHover();