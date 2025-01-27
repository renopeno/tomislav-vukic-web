function updateNavigationWithHref() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentHref = window.location.pathname; // Trenutni URL put
  
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
  
      if (currentHref === linkHref || (currentHref === '/' && linkHref === '/')) {
        // Ako se `currentHref` poklapa s `linkHref`, postavi kao current
        link.setAttribute('aria-current', 'page');
        link.classList.add('current');
        link.classList.add('w--current'); // Webflow klasa
      } else {
        // Ukloni current s drugih linkova
        link.removeAttribute('aria-current');
        link.classList.remove('current');
        link.classList.remove('w--current');
      }
    });
  
    console.log(`Navigacija ažurirana za href: ${currentHref}`);
  }
  

// Razdijeljivanje funkcija na globalne i page-specific, kako bi ih dolje lakše organizirao u viewsima
  function initGlobalFunctions() {
    if (typeof initFooter === 'function') initFooter();
    if (typeof initLinksHover === 'function') initLinksHover();
    if (typeof initDarkMode === 'function') initDarkMode();
    if (typeof initLenis === 'function') initLenis();
    if (typeof initGsapPlugins === 'function') initGsapPlugins();
  }
  
  function initPageSpecificFunctions(namespace) {
    switch (namespace) {
      case 'home':
        if (typeof initHomeHero === 'function') initHomeHero();
        if (typeof initHomeHighlights === 'function') initHomeHighlights();
        if (typeof initHomeCategories === 'function') initHomeCategories();
        break;
      case 'work':
        if (typeof initPhotoGrid === 'function') initPhotoGrid();
        break;
      case 'about':
        // Dodaj init funkcije specifične za About page
        break;
      default:
        console.log(`No specific init functions for namespace: ${namespace}`);
        break;
    }
  }



  // Barba.js konfiguracija
  barba.init({
    transitions: [
      {
        name: 'fade',
        leave(data) {
          return gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.5,
          });
        },
        enter(data) {
          window.scrollTo(0, 0); // Resetiraj skrol na vrh
          return gsap.from(data.next.container, {
            opacity: 0,
            duration: 0.5,
          });
        },
      },
    ],
    views: [
        {
            namespace: 'home',
            afterEnter(data) {
            initGlobalFunctions();
            initPageSpecificFunctions('home');
            updateNavigationWithHref('home'); // Ažuriranje navigacije
            },
        },
        {
            namespace: 'work',
            afterEnter(data) {
            initGlobalFunctions();
            initPageSpecificFunctions('work');
            updateNavigationWithHref('work'); // Ažuriranje navigacije
            },
        },
    ],
  });