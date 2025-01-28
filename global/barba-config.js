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
}

function initGlobalFunctions() {
  initLenis?.();
  initLinksHover?.();
  initFooter?.();
}

function initPageSpecificFunctions(namespace) {
  switch (namespace) {
    case 'home':
      console.log('Initializing home page functions');
      initHomeHero?.();
      initHomeHighlights?.();
      initHomeCategories?.();
      break;
    case 'work':
      console.log('Initializing work page functions');
      initPhotoGrid?.();
      break;
    case 'about':
      console.log('Initializing about page functions');
      initAbout?.();
      break;
    default:
      console.log(`No specific functions for namespace: ${namespace}`);
  }
}

function destroyPageSpecificFunctions(namespace) {
  // Resetiraj sve ScrollTrigger instance
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  console.log(`ScrollTrigger killed for ${namespace} namespace.`);
}

function initBarba() {
  barba.init({
    debug: true,
    sync: true,
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
        beforeLeave(data) {
          destroyPageSpecificFunctions('home');
        },
        afterEnter(data) {
          initGlobalFunctions();
          initPageSpecificFunctions('home');
          updateNavigationWithHref();
        },
      },
      {
        namespace: 'work',
        beforeLeave(data) {
          destroyPageSpecificFunctions('work');
        },
        afterEnter(data) {
          initGlobalFunctions();
          initPageSpecificFunctions('work');
          updateNavigationWithHref();
        },
      },
      {
        namespace: 'about',
        beforeLeave(data) {
          destroyPageSpecificFunctions('about');
        },
        afterEnter(data) {
          initGlobalFunctions();
          initPageSpecificFunctions('about');
          updateNavigationWithHref();
        },
      },
    ],
  });
}

initBarba();