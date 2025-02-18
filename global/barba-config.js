function initBarba() {
  console.log("🚀 Inicijalizacija Barba.js");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        console.log(`👋 Leave: ${data.current.namespace} ➝ ${data.next.namespace}`);
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      beforeEnter(data) {
        console.log("🏃 beforeEnter započeo");
        window.scrollTo(0, 0);
        
        if (typeof initGlobalFunctions === 'function') {
          console.log("🔄 Pozivam initGlobalFunctions");
          initGlobalFunctions(data);
        } else {
          console.error("❌ initGlobalFunctions nije definirana");
        }

        if (typeof initPageSpecificFunctions === 'function') {
          console.log("🔄 Pozivam initPageSpecificFunctions");
          initPageSpecificFunctions(data.next.namespace);
        } else {
          console.error("❌ initPageSpecificFunctions nije definirana");
        }

        gsap.set(data.next.container, { opacity: 0 });
      },
      enter(data) {
        console.log("🎯 Enter započeo");
        if (typeof updateNavigationWithHref === 'function') {
          updateNavigationWithHref();
        } else {
          console.error("❌ updateNavigationWithHref nije definirana");
        }
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

  console.log("✅ Barba.js inicijaliziran");
}

window.addEventListener('beforeunload', () => {
  console.log("🔄 Resetiram scroll prije napuštanja stranice");
  window.scrollTo(0, 0);
});

initBarba();