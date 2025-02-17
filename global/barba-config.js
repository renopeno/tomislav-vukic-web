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
  console.log(`🔄 Barba: Cleanup za ${namespace}`);
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

function initGlobalFunctions(data) {
  destroyPageSpecificFunctions?.(data?.current?.namespace);

  // Reset scrolla
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  // Ponovno pokreni Lenis ako postoji
  if (window.lenis) {
    window.lenis.destroy();
    initLenis?.();
  }

  // Ostale inicijalizacije
  initLinksHover?.();
  initFooter?.();

  document.body.style.overflow = '';
}

function initPageSpecificFunctions(namespace) {
  if (namespace.startsWith('work')) {
    initGrid?.();
    initPhotoModal?.();
  } else if (namespace === 'about') {
    initAbout?.();
  }
}

function initBarba() {
  console.log("🚀 Inicijalizacija Barba.js");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        console.log(`👋 Leave: ${data.current.namespace} ➝ ${data.next.namespace}`);
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      beforeEnter(data) {
        console.log("🏃 beforeEnter započeo");
        window.scrollTo(0, 0);
        initGlobalFunctions(data);
        initPageSpecificFunctions(data.next.namespace);
        gsap.set(data.next.container, { opacity: 0 });
      },
      enter(data) {
        console.log("🎯 Enter započeo");
        updateNavigationWithHref();
        return gsap.to(data.next.container, { opacity: 1, duration: 0.3 });
      }
    }],
    views: [
      { namespace: 'home' },
      { namespace: 'work' },
      { namespace: 'about' },
      { namespace: 'work-abstract' },
      { namespace: 'work-nature' },
      { namespace: 'work-people' },
      { namespace: 'work-products' },
      { namespace: 'work-architecture' }
    ]
  });
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

initBarba();