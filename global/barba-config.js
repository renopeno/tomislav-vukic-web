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

// Globalna varijabla za praćenje stanja tranzicije
window.isTransitioning = false;

// Funkcija za popravak Safari blend mode problema
function fixSafariBlendMode() {
  // Detektiraj Safari i iOS
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isSafari || isIOS) {
    console.log("Safari/iOS detektiran - primjenjujem popravak za blend mode");
    
    // Dodaj mali timeout da se osigura da se blend mode primijeni nakon rendera
    setTimeout(() => {
      // Poboljšaj klikabilnost linkova u navigaciji
      const navLinks = document.querySelectorAll('.nav-link, .link');
      navLinks.forEach(link => {
        // Dodaj mali z-index boost za Safari
        link.style.zIndex = "100000";
        link.style.position = "relative";
      });
    }, 100);
  }
}

function initBarba() {
  console.log("📌 Barba.js initialized");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Pozovi popravak za Safari prije inicijalizacije Barba.js
  fixSafariBlendMode();

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        window.isTransitioning = true;
        console.log(`🔄 Leaving: ${data.current.namespace}`);
        
        // Osiguraj da su svi linkovi klikabilni tijekom tranzicije
        const navLinks = document.querySelectorAll('.nav-link, .link');
        navLinks.forEach(link => {
          link.style.pointerEvents = 'auto';
        });
        
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
        console.log(`🎯 Entering: ${data.next.namespace}`);
        
        // Samo ovdje inicijaliziramo grid
        if (data.next.namespace.includes('work-')) {
          initGrid();
          initPhotoModal?.();
        }
        
        updateNavigationWithHref();
        
        // Primijeni popravak za Safari blend mode nakon tranzicije
        fixSafariBlendMode();
        
        // Postavi tranziciju na false nakon što je animacija završila
        return gsap.to(data.next.container, { 
          opacity: 1, 
          duration: 0.3,
          onComplete: () => {
            window.isTransitioning = false;
          }
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
    ],
    // Dodaj preventCheck za poboljšanje pouzdanosti
    preventRunning: true
  });

  console.log("✅ Barba.js initialized successfully");
}

window.addEventListener('beforeunload', () => {
  console.log("🔄 Resetting scroll before leaving the page");
  window.scrollTo(0, 0);
});

function initGrid() {
  if (window.isSettingUpGrid || window.isTransitioning) {
    console.log('🚫 Grid setup already in progress or transition active');
    return;
  }
  
  // Ostatak koda...
}

// Pozovi funkciju za popravak blend mode-a nakon učitavanja stranice
document.addEventListener('DOMContentLoaded', fixSafariBlendMode);

initBarba();