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
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  
  const splits = document.querySelectorAll('.split-type');
  splits.forEach(split => {
    if (split.splitType) split.splitType.revert();
  });
}

function initGlobalFunctions(data) {
  destroyPageSpecificFunctions(data.current.namespace);
  initLenis?.();
  initLinksHover?.();
  initFooter?.();
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
      break;
    case 'about':
      console.log('Initializing about page-specific functions');
      initAbout?.();
      break;
    default:
      console.log(`No page-specific functions for namespace: ${namespace}`);
  }
}

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
  destroyPageSpecificFunctions?.(data.current.namespace);
  initLenis?.();
  initLinksHover?.();
  initFooter?.();
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
      break;
    case 'about':
      console.log('Initializing about page-specific functions');
      initAbout?.();
      break;
    default:
      console.log(`No page-specific functions for namespace: ${namespace}`);
  }
}


function initBarba() {
  barba.init({
    transitions: [
      {
        name: 'fade',
        leave(data) {
          return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
        },
        beforeEnter(data) {
          initGlobalFunctions();
          initPageSpecificFunctions(data.next.namespace);
          gsap.set(data.next.namespace, { opacity: 0 });
          console.log(`🔄 Preparing to enter ${data.next.namespace}`);
        },
        enter(data) {
          console.log(`🔄 Entering ${data.next.namespace}`);
          updateNavigationWithHref();
          showContainer();
        }
      }
    ],
    views: [
      {
        namespace: 'home'
      },
      {
        namespace: 'work'
      },
      {
        namespace: 'about'
      }
    ]
  });
}


initBarba();