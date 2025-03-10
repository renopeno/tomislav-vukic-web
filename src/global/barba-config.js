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
        window.scrollTo(0, 0);
      },
      enter(data) {
        isTransitioning = false;
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

  // 🔹 Ovdje ubacujemo afterEnter hook
  barba.hooks.afterEnter(() => {
    console.log("✅ Reinitializing JavaScript after page transition...");

    // Ponovno učitaj main.js
    import('/dist/main.js')
        .then(() => {
            console.log("✅ main.js reloaded.");
            // reloadGlobalFunctions();
            // reloadPageSpecificFunctions(barba.history.current.namespace);
        })
        .catch(err => console.error("❌ Error loading main.js:", err));
  });

  console.log("✅ Barba.js initialized successfully");
}

window.addEventListener('beforeunload', () => {
  console.log("🔄 Resetting scroll before leaving the page");
  window.scrollTo(0, 0);
});

initBarba();