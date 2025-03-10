// let isTransitioning = false;

// if (typeof window.barbaInitialized === 'undefined') {
//   window.barbaInitialized = false;
// }

export default function initBarba() {
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
                isTransitioning = false;
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
}
}

// // Inicijaliziramo Barba.js samo jednom
initBarba();