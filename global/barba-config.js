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
  console.log(`🔄 Barba: Cleaning up ${namespace}`);
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  const splits = document.querySelectorAll('.split-type');
  splits.forEach(split => {
    if (split.splitType) split.splitType.revert();
  });

  console.log(`✅ Cleanup complete for ${namespace}`);
}

function initGlobalFunctions(data) {
  destroyPageSpecificFunctions?.(data?.current?.namespace);
  
  // Resetiraj scroll
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  // Ponovno inicijaliziraj Lenis i ostale globalne funkcije
  if (window.lenis) {
    window.lenis.destroy();
  }
  initLenis?.();
  initLinksHover?.();
  initFooter?.();

  // Očuvaj Dark Mode
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  // Omogući scroll ponovno nakon inicijalizacije
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

function initBarba() {
  console.log("📌 Barba.js initialized");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        console.log(`🔄 Leaving: ${data.current.namespace}`);
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      beforeEnter(data) {
        console.log(`🔄 Before Entering: ${data.next.namespace}`);
        
        // Čišćenje prethodnog stanja
        if (data.current) {
          destroyPageSpecificFunctions(data.current.namespace);
        }

        window.scrollTo(0, 0);
        initGlobalFunctions(data);
        console.log('🔄 Page specific init:', {
          namespace: data.next.namespace,
          containers: document.querySelectorAll(".photo-container").length,
          currentPath: window.location.pathname
        });
        initPageSpecificFunctions(data.next.namespace);
        console.log('✅ Page specific init complete:', {
          namespace: data.next.namespace,
          containers: document.querySelectorAll(".photo-container").length
        });

        gsap.set(data.next.container, { opacity: 0 });
      },
      enter(data) {
        console.log(`🎯 Entering: ${data.next.namespace}`);
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

  console.log("✅ Barba.js initialized successfully");
}

window.addEventListener('beforeunload', () => {
  console.log("🔄 Resetting scroll before leaving the page");
  window.scrollTo(0, 0);
});

initBarba();