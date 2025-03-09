function initDarkMode() {
  const body = document.body;
  const themeSwitcher = document.querySelector('.nav-theme-switcher');

  // Primijeni Dark Mode odmah na početku
  if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('ui-dark-mode');
  }

  // Osiguraj da se Dark Mode pravilno prebacuje pri kliku na switcher
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      if (body.classList.contains('ui-dark-mode')) {
        body.classList.remove('ui-dark-mode');
        console.log("Removed .ui-dark-mode from body");
        localStorage.setItem('dark-mode', 'disabled');
      } else {
        body.classList.add('ui-dark-mode');
        console.log("Added .ui-dark-mode to body");
        localStorage.setItem('dark-mode', 'enabled');
      }
    });
  }
}

initDarkMode();