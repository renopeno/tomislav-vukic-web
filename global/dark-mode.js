function initDarkMode() {
  const body = document.body;
  const themeSwitcher = document.querySelector('.nav-theme-switcher');

  // Prikaz u konzoli koji mode je trenutno učitan
  const currentMode = localStorage.getItem('dark-mode') === 'enabled' ? 'Dark Mode' : 'Light Mode';
  console.log(`Initial mode: ${currentMode}`);

  //  Primijeni Dark Mode odmah na početku
  if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('ui-dark-mode');
  }

  //  Osiguraj da se Dark Mode pravilno prebacuje pri kliku na switcher
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      if (body.classList.contains('ui-dark-mode')) {
        body.classList.remove('ui-dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
        console.log("Switched to Light Mode");
      } else {
        body.classList.add('ui-dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
        console.log("Switched to Dark Mode");
      }
    });
  }
}

initDarkMode();