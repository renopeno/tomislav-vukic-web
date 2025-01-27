function initLinksHover() {
  document.querySelectorAll('.link').forEach(link => {
    const originalText = link.textContent;

    const shuffleWord = (word) => {
      const letters = word.split('');
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      return letters.join('');
    };

    link.addEventListener('mouseenter', () => {
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
  });
}

export { initLinksHover };