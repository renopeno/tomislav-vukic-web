// Webflow Reset - omogućava ponovno inicijaliziranje Webflow skripti nakon Barba tranzicije
// function webflowReset() {
//   window.Webflow && window.Webflow.destroy();
//   setTimeout(() => {
//     window.Webflow && window.Webflow.ready();
//     if (window.Webflow && window.Webflow.require && window.Webflow.require('ix2')) {
//       window.Webflow.require('ix2').init();
//     }
//   });
// }

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
  initDarkMode?.();
  initLenis?.();
  initLinksHover?.();
  initFooter?.();
  initIosSafariFix?.();
  initLenis?.();
  
  
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
      initAboutSection?.();
      initHighlights?.();
      initCategories?.();
      break;
    case 'work' || 'work-abstract' || 'work-nature' || 'work-people' || 'work-products' || 'work-architecture':
      initWork?.();
      initCategoryTitleAnimation?.();
      initPhotoModal?.();
      break;
    case 'about':
      initAbout?.();
      break;
  }
}

// let isTransitioning = false;

function initBarba() {
  console.log("📌 Barba.js initialized");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        // isTransitioning = true;
        console.log(`🔄 Leaving: ${data.current.namespace}`);
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      beforeEnter(data) {
        // if (data.current) {
        //   destroyPageSpecificFunctions(data.current.namespace);
        // }
          // Start or resume the Lenis smooth scrolling functionality.
          lenis.start()
          if (lenis) {
            // scroll to the top using Lenis immediately (no smooth scrolling).
            lenis.scrollTo(0, { immediate: true });
          } else {
            // If 'lenis' is not defined, fall back to the default browser scroll behavior.
            window.scrollTo(0, 0)
        }
      },
      enter(data) {
        isTransitioning = false;
        console.log(`🎯 Entering: ${data.next.namespace}`);
        
        // Samo ovdje inicijaliziramo grid
        // if (data.next.namespace.includes('work-')) {
        //   initGrid();
        //   initPhotoModal?.();
        // }

      },
      enter(data) {
        // isTransitioning = false;
        console.log(`🎯 Entering: ${data.next.namespace}`);
        
        // Samo ovdje inicijaliziramo grid
        // if (data.next.namespace.includes('work-')) {
        //   initGrid();
        //   initPhotoModal?.();
        // }

        // Osiguraj pokretanje specifičnih funkcija stranice nakon tranzicije
        // setTimeout(() => {
        //   initPageSpecificFunctions(data.next.namespace);
        // }, 100);

        // updateNavigationWithHref();
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

// // Inicijalizacija custom funkcija nakon Barba tranzicija
// function initScripts() {
//   console.log("Inicijaliziram custom JS funkcije...");

//   // Sigurnosna provjera da li su funkcije definirane prije poziva
//   if (typeof initDarkMode === "function") initDarkMode();
//   if (typeof initFooter === "function") initFooter();
//   if (typeof initAbout === "function") initAbout();
//   if (typeof initLinksHover === "function") initLinksHover();
//   if (typeof initIosSafariFix === "function") initIosSafariFix();
//   if (typeof initLenis === "function") initLenis();
//   if (typeof initHero === "function") initHero();
//   if (typeof initAboutSection === "function") initAboutSection();
//   if (typeof initHighlights === "function") initHighlights();
//   if (typeof initCategories === "function") initCategories();
//   if (typeof initWork === "function") initWork();
//   if (typeof initPhotoModal === "function") {
//     try {
//       initPhotoModal();
//     } catch (error) {
//       console.error("Greška u initPhotoModal:", error);
//     }
//   }

//   // Ponovno dodavanje event listenera za sve gumbe
//   document.querySelectorAll(".some-button").forEach(button => {
//     button.addEventListener("click", () => {
//       console.log("Kliknut button nakon Barba tranzicije!");
//     });
//   });
// }

// barba.init({
//   transitions: [
//     {
//       name: 'fade',
//       leave(data) {
//         if (data.current.container) {
//           return gsap.to(data.current.container, { opacity: 0, duration: 0.5 });
//         }
//       },
//       enter(data) {
//         webflowReset();
//         setTimeout(initScripts, 100);
//         if (data.next.container) {
//           return gsap.from(data.next.container, { opacity: 0, duration: 0.5 });
//         }
//       }
//     }
//   ],
//   views: [
//     { namespace: 'home', afterEnter() { webflowReset(); setTimeout(initScripts, 100); console.log('Home page loaded'); } },
//     { namespace: 'work', afterEnter() { webflowReset(); setTimeout(initScripts, 100); console.log('Work page loaded'); } },
//     { namespace: 'about', afterEnter() { webflowReset(); setTimeout(initScripts, 100); console.log('About page loaded'); } }
//   ]
// });

// // Pokreni skripte odmah prilikom prvog učitavanja stranice
// initScripts();


