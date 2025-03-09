function initDarkMode() {
  const body = document.body;
  const html = document.documentElement;
  const themeSwitcher = document.querySelector('.nav-theme-switcher');

  // Primijeni Dark Mode odmah na početku
  if (localStorage.getItem('dark-mode') === 'enabled') {
    html.classList.add('ui-dark-mode'); // Dodajemo na <html> umjesto samo na <body>
    body.classList.add('ui-dark-mode');
  }

  // Osiguraj da se Dark Mode pravilno prebacuje pri kliku na switcher
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      if (body.classList.contains('ui-dark-mode')) {
        html.classList.remove('ui-dark-mode');
        body.classList.remove('ui-dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
      } else {
        html.classList.add('ui-dark-mode');
        body.classList.add('ui-dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
      }
    });
  }
}

// Izvrši dodavanje klase odmah pri učitavanju kako bi se izbjegao bljesak
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.documentElement.classList.add('ui-dark-mode');
}

initDarkMode();