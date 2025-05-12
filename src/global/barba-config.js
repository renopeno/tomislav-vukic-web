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
  console.log('📍 Ažuriranje navigacije s trenutačnim href-om');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentHref = window.location.pathname;

  console.log(`🔍 Trenutni URL path: ${currentHref}`);
  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    console.log(`📌 Provjeravam link: ${linkHref}`);
    if (currentHref === linkHref || (currentHref === '/' && linkHref === '/')) {
      console.log(`✅ Link postavljen kao aktivan: ${linkHref}`);
      link.setAttribute('aria-current', 'page');
      link.classList.add('current', 'w--current');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('current', 'w--current');
    }
  });
  console.log('✅ Navigacija uspješno ažurirana');
}

function destroyPageSpecificFunctions(namespace) {
  console.log(`🧹 Započinjem čišćenje za namespace: ${namespace}`);
  
  console.log('🔄 Uklanjam ScrollTrigger instance');
  ScrollTrigger.getAll().forEach((trigger) => {
    console.log(`  - Uklanjam trigger: ${trigger.vars.id || 'bez ID-a'}`);
    trigger.kill();
  });

  console.log('🔄 Vraćam SplitType instance u početno stanje');
  const splits = document.querySelectorAll('.split-type');
  console.log(`  - Pronađeno ${splits.length} SplitType elemenata`);
  splits.forEach(split => {
    if (split.splitType) {
      console.log(`  - Vraćam SplitType u početno stanje za: ${split.className}`);
      split.splitType.revert();
    }
  });

  console.log(`✅ Čišćenje za ${namespace} uspješno završeno`);
}

function initGlobalFunctions(data) {
  console.log('🚀 Inicijalizacija globalnih funkcija');
  console.log('🔄 Premještanje skrola na vrh stranice');
  window.scrollTo(0, 0);
  
  console.log('🔒 Postavljanje overflow:hidden na body');
  document.body.style.overflow = 'hidden';
  
  if (window.lenis) {
    console.log('🛑 Uništavam postojeću Lenis instancu');
    window.lenis.destroy();
  }
  
  console.log('🌓 Inicijalizacija Dark Mode-a');
  initDarkMode?.();
  
  console.log('🔄 Inicijalizacija Lenis smooth scroll-a');
  initLenis?.();
  
  console.log('🔗 Inicijalizacija hover efekta na linkovima');
  initLinksHover?.();
  
  console.log('👣 Inicijalizacija footera');
  initFooter?.();
  
  console.log('📱 Inicijalizacija iOS Safari popravka');
  initIosSafariFix?.();
  
  console.log('🔄 Ponovno inicijalizacija Lenis-a (duplikacija?)');
  initLenis?.();
  
  console.log('🌓 Primjena Dark Mode postavki iz localStorage-a');
  if (localStorage.getItem("darkMode") === "enabled") {
    console.log('  - Dark Mode aktivan');
    document.body.classList.add("dark-mode");
  } else {
    console.log('  - Dark Mode neaktivan');
    document.body.classList.remove("dark-mode");
  }
  
  console.log('🔓 Vraćanje normalnog overflow svojstva na body');
  document.body.style.overflow = '';
  
  console.log('✅ Globalne funkcije uspješno inicijalizirane');
}

function initPageSpecificFunctions(namespace) {
  console.log(`🏗️ Inicijalizacija specifičnih funkcija za stranicu: ${namespace}`);
  
  switch (namespace) {
    case 'home':
      console.log('🏠 Učitavanje HOME komponenti:');
      console.log('  - Inicijalizacija Hero sekcije');
      initHero?.();
      console.log('  - Inicijalizacija About sekcije');
      initAboutSection?.();
      console.log('  - Inicijalizacija Highlights sekcije');
      initHighlights?.();
      console.log('  - Inicijalizacija Categories sekcije');
      initCategories?.();
      break;
    case 'work':
    case 'work-abstract':
    case 'work-nature': 
    case 'work-people': 
    case 'work-products': 
    case 'work-architecture':
      console.log('💼 Učitavanje WORK komponenti:');
      console.log('  - Inicijalizacija Work sekcije');
      initWork?.();
      console.log('  - Inicijalizacija animacije naslova kategorije');
      initCategoryTitleAnimation?.();
      console.log('  - Inicijalizacija Photo modala');
      initPhotoModal?.();
      break;
    case 'about':
      console.log('👤 Učitavanje ABOUT komponenti:');
      console.log('  - Inicijalizacija About sekcije');
      initAbout?.();
      break;
    default:
      console.log(`⚠️ Nepoznati namespace: ${namespace}, ne inicijaliziram specifične funkcije`);
  }
  
  console.log(`✅ Inicijalizacija stranice ${namespace} završena`);
}

// let isTransitioning = false;

function initBarba() {
  console.log("🔄 Započinjem inicijalizaciju Barba.js");
  console.log("📋 Postavljam history.scrollRestoration na 'manual'");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  console.log("⚙️ Konfiguriram Barba.js tranzicije i namespace-ove");
  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        console.log(`🚪 LEAVE: Napuštam stranicu ${data.current.namespace}`);
        console.log(`  - URL: ${data.current.url.path}`);
        console.log(`  - Primjenjujem izlaznu animaciju (opacity: 0)`);
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      beforeEnter(data) {
        console.log(`🔑 BEFORE ENTER: Pripremam ulazak na stranicu ${data.next.namespace}`);
        console.log(`  - URL: ${data.next.url.path}`);
        
        console.log('  - Pokrećem Lenis');
        lenis.start();
        
        if (lenis) {
          console.log('  - Postavljam scroll na vrh bez animacije (immediate: true)');
          lenis.scrollTo(0, { immediate: true });
        } else {
          console.log('  - Lenis nije definiran, koristim standardni window.scrollTo');
          window.scrollTo(0, 0);
        }
      },
      enter(data) {
        console.log(`🚪 ENTER: Ulazim na stranicu ${data.next.namespace}`);
        console.log(`  - URL: ${data.next.url.path}`);
        console.log(`  - Primjenjujem ulaznu animaciju (opacity: 1)`);
        return gsap.to(data.next.container, { opacity: 1, duration: 0.3 });
      },
      after(data) {
        console.log(`🎭 AFTER: Tranzicija na ${data.next.namespace} završena`);
        console.log(`  - Pozivam inicijalizaciju specifičnih funkcija za ${data.next.namespace}`);
        initPageSpecificFunctions(data.next.namespace);
        console.log(`  - Ažuriram status navigacije`);
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

  console.log("✅ Barba.js uspješno inicijaliziran");
}

window.addEventListener('beforeunload', () => {
  console.log("🔄 beforeunload: Resetiram scroll prije napuštanja stranice");
  window.scrollTo(0, 0);
});

console.log("🚀 Pokrećem Barba.js inicijalizaciju");
initBarba();
console.log("✅ Barba.js konfiguracija kompletna");

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


