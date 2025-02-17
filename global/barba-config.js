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

function initGlobalFunctions(data) {
  // Prvo resetiraj scroll
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  // Zatim inicijaliziraj Lenis
  if (window.lenis) {
    window.lenis.destroy();
  }
  initLenis?.();

  // Ostale inicijalizacije
  initLinksHover?.();
  initFooter?.();

  // Na kraju omogući scroll
  document.body.style.overflow = '';
}

function initPageSpecificFunctions(namespace) {
  switch (namespace) {
    case 'home':
      initHero?.();
      initHighlights?.();
      initCategories?.();
      break;
    case 'work':
    case 'work-abstract':
    case 'work-nature':
    case 'work-people':
    case 'work-products':
    case 'work-architecture':
      initGrid?.();
      initPhotoModal?.();
      break;
    case 'about':
      initAbout?.();
      break;
  }
}

function showContainer(data) {
  return gsap.to(data.next.container, {
    opacity: 1,
    duration: 0.3
  });
}

function initBarba() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        console.log(`🔄 Leave: ${data.current.namespace}`);
        return gsap.to(data.current.container, { 
          opacity: 0, 
          duration: 0.3
        });
      },
      beforeEnter(data) {
        console.log(`🔄 BeforeEnter: ${data.next.namespace}`);
        
        // Čistimo prethodno stanje samo jednom
        if (data.current) {
          destroyPageSpecificFunctions(data.current.namespace);
        }
        
        window.scrollTo(0, 0);
        initGlobalFunctions(data);
        initPageSpecificFunctions(data.next.namespace);
        
        gsap.set(data.next.container, { opacity: 0 });
      },
      enter(data) {
        console.log(`�� Enter: ${data.next.namespace}`);
        updateNavigationWithHref();
        return gsap.to(data.next.container, { 
          opacity: 1, 
          duration: 0.3
        });
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