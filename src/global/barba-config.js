// let isTransitioning = false;

// // Koristimo globalnu varijablu na window objektu koja će se zadržati između učitavanja skripti
// if (typeof window.barbaInitialized === 'undefined') {
//   window.barbaInitialized = false;
// }

export default function initBarba() {
//   if (window.barbaInitialized) {
//     console.log("⚠️ Barba.js već inicijalizirana, preskačem...");
//     return;
//   }
  
//   console.log("📌 Barba.js initialized");

//   if ('scrollRestoration' in history) {
//     history.scrollRestoration = 'manual';
//   }

//   barba.init({
//     transitions: [{
//       name: 'fade',
//       leave(data) {
//         // Uništavanje skripti prije nego što stranica napusti prikaz
//         destroyPageSpecificFunctions(data.current.namespace);
//         return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
//       },
//       enter(data) {
//         // Inicijalizacija skripti nakon što nova stranica uđe u prikaz
//         initPageSpecificFunctions(data.next.namespace);
//         isTransitioning = false;
//         console.log(`🎯 Entering: ${data.next.namespace}`);
//         updateNavigationWithHref();
//       }
//     }],
//     views: [
//       { namespace: 'home' },
//       { namespace: 'work' },
//       { namespace: 'about' },
//       { namespace: 'work-abstract' },
//       { namespace: 'work-nature' },
//       { namespace: 'work-people' },
//       { namespace: 'work-products' },
//       { namespace: 'work-architecture' }
//     ]
//   });

//   barba.hooks.afterEnter(() => {
//     console.log("✅ Reinitializing JavaScript after page transition...");

//     try {
//       // Umjesto ponovnog učitavanja cijele skripte, pozivamo samo funkcije specifične za stranicu
//       // Možemo koristiti custom event za komunikaciju s drugim skriptama
//       const pageChangeEvent = new CustomEvent('barbaPageChanged', {
//         detail: { namespace: barba.history.current.namespace }
//       });
//       document.dispatchEvent(pageChangeEvent);
      
//       console.log("✅ Page-specific functions reloaded.");
//     } catch (err) {
//       console.error("❌ Error reloading page functions:", err);
//     }
//   });

//   window.barbaInitialized = true;
//   console.log("✅ Barba.js initialized successfully");
// }

// // window.addEventListener('beforeunload', () => {
// //   console.log("🔄 Resetting scroll before leaving the page");
// //   window.scrollTo(0, 0);
// // });

// // Funkcija za inicijalizaciju skripti specifičnih za stranicu
// function initPageSpecificFunctions(namespace) {
//   if (namespace === 'home') {
//     window.initHero();
//     window.initAboutSection();
//     window.initHighlights();
//     window.initCategories();
//   } else if (namespace === 'about') {
//     window.initAbout();
//   } else if (namespace === 'work') {
//     window.initGrid();
//     window.initPhotoModal();
//   }
//   // Dodajte ostale stranice prema potrebi
// }

// // Funkcija za uništavanje skripti specifičnih za stranicu
// function destroyPageSpecificFunctions(namespace) {
//   // Implementirajte logiku za uništavanje skripti ako je potrebno
}

// // Inicijaliziramo Barba.js samo jednom
initBarba();