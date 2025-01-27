function updateNavigationWithHref() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentHref = window.location.pathname;

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');

    if (currentHref === linkHref || (currentHref === '/' && linkHref === '/')) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('current', 'w--current');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('current', 'w--current');
    }
  });

  console.log(`Navigacija ažurirana za href: ${currentHref}`);
}

function initGlobalFunctions() {
  initGsapPlugins();
  initFooter?.();
  initLinksHover?.();
  initDarkMode?.();
  initLenis?.();
}

function initPageSpecificFunctions(namespace) {
  switch (namespace) {
    case 'home':
      initHomeHero?.();
      initHomeHighlights?.();
      initHomeCategories?.();
      break;
    case 'work':
      initPhotoGrid?.();
      break;
    case 'about':
      // Dodaj init funkcije specifične za About page
      break;
    default:
      console.log(`No specific init functions for namespace: ${namespace}`);
      break;
  }
}

function initBarba() {
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
          window.scrollTo(0, 0); // Resetiraj scroll na vrh
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
          updateNavigationWithHref();
        },
      },
      {
        namespace: 'work',
        afterEnter(data) {
          initGlobalFunctions();
          initPageSpecificFunctions('work');
          updateNavigationWithHref();
        },
      },
    ],
  });
}

initBarba();