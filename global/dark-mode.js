function initDarkMode () {
  document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.querySelector('.nav-theme-switcher');
    const body = document.body;
  
    // Provjeri je li već spremljeno stanje u localStorage
    if (localStorage.getItem('dark-mode') === 'enabled') {
      body.classList.add('ui-dark-mode'); // Postavi dark mode
    }
  
    // Dodaj event listener za klik na theme switcher
    themeSwitcher.addEventListener('click', () => {
      // Provjeri ima li body već klasu `.ui-dark-mode`
      if (body.classList.contains('ui-dark-mode')) {
        body.classList.remove('ui-dark-mode'); // Makni klasu za dark mode
        localStorage.setItem('dark-mode', 'disabled'); // Spremi stanje u localStorage
      } else {
        body.classList.add('ui-dark-mode'); // Dodaj klasu za dark mode
        localStorage.setItem('dark-mode', 'enabled'); // Spremi stanje u localStorage
      }
    });
  });
}