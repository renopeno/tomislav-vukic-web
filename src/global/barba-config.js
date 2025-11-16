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
  // Očisti Photo Modal ako napuštamo work page
  if (namespace.startsWith('work') && window.photoModalCleanup) {
    window.photoModalCleanup();
  }
  
  // Očisti work page observers
  if (namespace.startsWith('work') && window.cleanupWorkPage) {
    window.cleanupWorkPage();
  }
  
  // Ukloni ScrollTrigger instance
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });

  // Vrati SplitType instance u početno stanje
  const splits = document.querySelectorAll('.split-type');
  splits.forEach(split => {
    if (split.splitType) {
      split.splitType.revert();
    }
  });
}

function initGlobalFunctions(data) {
  initDarkMode?.();
  initLinksHover?.();
  initFooter?.();
  initIosSafariFix?.();
  
  if (!window.lenis) {
    initLenis?.();
  }
}

function initPageSpecificFunctions(namespace) {
  switch (namespace) {
    case 'home':
      window.initHero?.();
      window.initAboutSection?.();
      window.initHighlights?.();
      window.initCategories?.();
      break;
    case 'work':
    case 'work-abstract':
    case 'work-nature': 
    case 'work-people': 
    case 'work-products': 
    case 'work-architecture':
      window.initWork?.();
      window.initCategoryTitleAnimation?.();
      window.initWorkCategoriesReveal?.();
      window.initPhotoModal?.();
      break;
    case 'about':
      window.initAbout?.();
      break;
    default:
      console.warn(`⚠️ Nepoznati namespace: ${namespace}`);
  }
}

// let isTransitioning = false;

function initBarba() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Globalni hook - osigurava da dark mode bude primijenjen UVIJEK prije svake tranzicije
  barba.hooks.beforeEnter(() => {
    if (localStorage.getItem("dark-mode") === "enabled") {
      document.documentElement.classList.add("ui-dark-mode");
      document.body.classList.add("ui-dark-mode");
    } else {
      document.documentElement.classList.remove("ui-dark-mode");
      document.body.classList.remove("ui-dark-mode");
    }
  });
  
  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        // Zaustavi Lenis tijekom tranzicije
        if (window.lenis) {
          window.lenis.stop();
        }
        
        // ✅ Update navigation ODMAH da nema percipirani delay
        updateNavigationWithHref();
        
        // 🧹 Očisti page-specific funkcije prije napuštanja
        destroyPageSpecificFunctions(data.current.namespace);
        
        // 🌓 Primijeni dark mode i na izlasku da se spriječi flicker
        if (localStorage.getItem("dark-mode") === "enabled") {
          document.documentElement.classList.add("ui-dark-mode");
          document.body.classList.add("ui-dark-mode");
        }
        
        return gsap.to(data.current.container, { opacity: 0, duration: 0.15 });
      },
      beforeEnter(data) {
        // 🌓 KRITIČNO: Primijeni dark mode ODMAH prije nego što se stranica prikaže
        if (localStorage.getItem("dark-mode") === "enabled") {
          document.documentElement.classList.add("ui-dark-mode");
          document.body.classList.add("ui-dark-mode");
        } else {
          document.documentElement.classList.remove("ui-dark-mode");
          document.body.classList.remove("ui-dark-mode");
        }
        
        // Sakrij category title ODMAH da spriječi flash
        const categoryTitle = data.next.container.querySelector?.('.category-title');
        if (categoryTitle) {
          categoryTitle.style.opacity = '0';
          categoryTitle.style.visibility = 'hidden';
        }
        
        // Postavi scroll na vrh
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true, force: true });
        } else {
          window.scrollTo(0, 0);
        }
      },
      enter(data) {
        return gsap.to(data.next.container, { opacity: 1, duration: 0.15 });
      },
      after(data) {
        initPageSpecificFunctions(data.next.namespace);
        
        // Pokreni Lenis i osvježi ScrollTrigger
        requestAnimationFrame(() => {
          if (window.lenis) {
            window.lenis.start();
          }
          ScrollTrigger.refresh(true);
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

// Prvi load - inicijalizacija trenutne stranice
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const currentNamespace = document.querySelector('[data-barba="container"]')?.getAttribute('data-barba-namespace');
    if (currentNamespace) {
      initPageSpecificFunctions(currentNamespace);
    }
  });
} else {
  const currentNamespace = document.querySelector('[data-barba="container"]')?.getAttribute('data-barba-namespace');
  if (currentNamespace) {
    initPageSpecificFunctions(currentNamespace);
  }
}

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
//   });

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


