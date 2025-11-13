function initDarkMode() {
  const body = document.body;
  const themeSwitcher = document.querySelector('.nav-theme-switcher');

  // ✅ Primijeni Dark Mode odmah na početku (samo pri prvom učitavanju)
  if (localStorage.getItem('dark-mode') === 'enabled') {
    document.documentElement.classList.add('ui-dark-mode');
    body.classList.add('ui-dark-mode');
  } else {
    document.documentElement.classList.remove('ui-dark-mode');
    body.classList.remove('ui-dark-mode');
  }

  // ✅ Osiguraj da se Dark Mode pravilno prebacuje pri kliku na switcher
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      if (body.classList.contains('ui-dark-mode')) {
        document.documentElement.classList.remove('ui-dark-mode');
        body.classList.remove('ui-dark-mode');
        console.log("Removed .ui-dark-mode from html and body");
        localStorage.setItem('dark-mode', 'disabled');
      } else {
        document.documentElement.classList.add('ui-dark-mode');
        body.classList.add('ui-dark-mode');
        console.log("Added .ui-dark-mode to html and body");
        localStorage.setItem('dark-mode', 'enabled');
      }
    });
  }

  // ✅ Osiguraj primjenu pri svakoj Barba.js tranziciji
  // if (window.barba) {
  //   barba.hooks.beforeEnter(() => {
  //     if (localStorage.getItem('dark-mode') === 'enabled') {
  //       document.body.classList.add('ui-dark-mode');
  //     } else {
  //       document.body.classList.remove('ui-dark-mode');
  //     }
  //   });
  // }
}

window.initDarkMode = initDarkMode;
initDarkMode();