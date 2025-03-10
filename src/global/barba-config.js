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
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  
  if (window.lenis) {
    window.lenis.destroy();
  }
  initLenis?.();
  initLinksHover?.();
  initFooter?.();
  
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  
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

let isTransitioning = false;

function initBarba() {
  console.log("📌 Barba.js initialized");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        isTransitioning = true;
        console.log(`🔄 Leaving: ${data.current.namespace}`);
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      beforeEnter(data) {
        if (data.current) {
          destroyPageSpecificFunctions(data.current.namespace);
        }
        
        window.scrollTo(0, 0);
        initGlobalFunctions(data);
      },
      enter(data) {
        isTransitioning = false;
        console.log(`🎯 Entering: ${data.next.namespace}`);
        
        // Samo ovdje inicijaliziramo grid
        if (data.next.namespace.includes('work-')) {
          initGrid();
          initPhotoModal?.();
        }
        
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

function initGrid() {
  if (window.isSettingUpGrid || isTransitioning) {
    console.log('🚫 Grid setup already in progress or transition active');
    return;
  }
  
  // Ostatak koda...
}

initBarba();