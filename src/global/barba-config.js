// Inicijalizacija Barba.js
export default function initBarba() {
  if (typeof window.barbaInitialized === 'undefined') {
    window.barbaInitialized = false;
  }

  if (window.barbaInitialized) {
    console.log("⚠️ Barba.js već inicijalizirana, preskačem...");
    return;
  }

  console.log("📌 Barba.js initialized");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        // Uništavanje skripti prije nego što stranica napusti prikaz
        destroyPageSpecificFunctions(data.current.namespace);
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      enter(data) {
        // Inicijalizacija skripti nakon što nova stranica uđe u prikaz
        initPageSpecificFunctions(data.next.namespace);
        console.log(`🎯 Entering: ${data.next.namespace}`);
        updateNavigationWithHref();
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

  barba.hooks.afterEnter(() => {
    console.log("✅ Reinitializing JavaScript after page transition...");
    const pageChangeEvent = new CustomEvent('barbaPageChanged', {
      detail: { namespace: barba.history.current.namespace }
    });
    document.dispatchEvent(pageChangeEvent);
    console.log("✅ Page-specific functions reloaded.");
  });

  window.barbaInitialized = true;
  console.log("✅ Barba.js initialized successfully");
}

// Funkcija za inicijalizaciju skripti specifičnih za stranicu
function initPageSpecificFunctions(namespace) {
  if (namespace === 'home') {
    window.initHero();
    window.initAboutSection();
    window.initHighlights();
    window.initCategories();
  } else if (namespace === 'about') {
    window.initAbout();
  } else if (namespace === 'work') {
    window.initGrid();
    window.initPhotoModal();
  }
  // Dodajte ostale stranice prema potrebi
}

// Funkcija za uništavanje skripti specifičnih za stranicu
function destroyPageSpecificFunctions(namespace) {
  // Implementirajte logiku za uništavanje skripti ako je potrebno
}

// Funkcija za ažuriranje navigacije
function updateNavigationWithHref() {
  const curUrl = location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === curUrl || (curUrl.startsWith('/work/') && href === '/work') || (curUrl.startsWith('/about') && href === '/about')) {
      link.classList.add('w--current');
    } else {
      link.classList.remove('w--current');
    }
  });
}

// Inicijaliziramo Barba.js samo jednom
initBarba();
