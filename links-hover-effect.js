function initLinksHover () {
  document.querySelectorAll('.link').forEach(link => {
    const originalText = link.textContent;
  
    // Funkcija za generiranje random permutacije slova iz riječi
    const shuffleWord = word => {
      const letters = word.split('');
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      return letters.join('');
    };
  
    // Hover efekt
    link.addEventListener('mouseenter', () => {
      let currentText = originalText;
      let counter = 0;
  
      // Postavi interval za shuffle
      const shuffleInterval = setInterval(() => {
        if (counter < 3) {
          // Generiraj random riječ
          currentText = shuffleWord(originalText);
          link.textContent = currentText;
          counter++;
        } else {
          // Vrati originalnu riječ nakon 3 shufflea
          link.textContent = originalText;
          clearInterval(shuffleInterval);
        }
      }, 100); // 100ms između svake promjene
    });
  });
}