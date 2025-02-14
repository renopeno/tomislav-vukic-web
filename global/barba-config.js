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

function destroyPageSpecificFunctions(namespace) {
  console.log(`🔄 Barba: Starting cleanup for ${namespace}`);
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  
  const splits = document.querySelectorAll('.split-type');
  splits.forEach(split => {
    if (split.splitType) split.splitType.revert();
  });
  
  console.log(`✅ Barba: Cleanup done for ${namespace}`);
}

function getScrollPosition() {
  return {
    scrollY: window.scrollY || window.pageYOffset,
    documentHeight: Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    ),
    viewportHeight: window.innerHeight,
    bodyTop: document.body.getBoundingClientRect().top
  };
}

function logScrollPosition(message) {
  const pos = getScrollPosition();
  console.log(`🚀 ${message}:
    - window.scrollY: ${pos.scrollY}px
    - body.top: ${pos.bodyTop}px
    - document height: ${pos.documentHeight}px
    - viewport height: ${pos.viewportHeight}px
    - current namespace: ${barba?.currentNamespace || 'none'}
    - lenis enabled: ${!!window.lenis}
  `);
}

function initGlobalFunctions(data) {
  logScrollPosition('Starting global functions initialization');
  destroyPageSpecificFunctions?.(data?.current?.namespace);
  
  // Prvo resetiraj scroll
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  logScrollPosition('After initial scroll reset');

  // Zatim inicijaliziraj Lenis
  if (window.lenis) {
    logScrollPosition('Before destroying Lenis');
    window.lenis.destroy();
    logScrollPosition('After destroying Lenis');
  }
  initLenis?.();
  logScrollPosition('After Lenis reinitialization');

  // Ostale inicijalizacije
  initLinksHover?.();
  initFooter?.();

  // Na kraju omogući scroll
  document.body.style.overflow = '';
  logScrollPosition('After enabling scroll');
}

function initPageSpecificFunctions(namespace) {
  switch (namespace) {
    case 'home':
      console.log('Initializing home page-specific functions');
      initHero?.();
      initHighlights?.();
      initCategories?.();
      break;
    case 'work':
      console.log('Initializing work page-specific functions');
      initGrid?.();
      initPhotoModal?.();
      break;
    case 'about':
      console.log('Initializing about page-specific functions');
      initAbout?.();
      break;
    default:
      console.log(`No page-specific functions for namespace: ${namespace}`);
  }
}

function showContainer(data) {
  return gsap.to(data.next.container, {
    opacity: 1,
    duration: 0.3
  });
}

function initBarba() {
  logScrollPosition('Starting Barba initialization');
  
  // Spriječi scroll restore
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        logScrollPosition('Barba leave transition start');
        return gsap.to(data.current.container, { 
          opacity: 0, 
          duration: 0.3,
          onComplete: () => logScrollPosition('Barba leave transition complete')
        });
      },
      beforeEnter(data) {
        logScrollPosition('Barba before enter');
        window.scrollTo(0, 0);
        initGlobalFunctions(data);
        initPageSpecificFunctions(data.next.namespace);
        gsap.set(data.next.container, { opacity: 0 });
        logScrollPosition('Barba before enter complete');
      },
      enter(data) {
        logScrollPosition('Barba enter transition start');
        updateNavigationWithHref();
        return gsap.to(data.next.container, { 
          opacity: 1, 
          duration: 0.3,
          onComplete: () => logScrollPosition('Barba enter transition complete')
        });
      }
    }],
    views: [
      { namespace: 'home' },
      { namespace: 'work' },
      { namespace: 'about' }
    ]
  });

  logScrollPosition('Barba initialization complete');
}

// Dodaj event listener za refresh
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Pokreni inicijalizaciju
initBarba();