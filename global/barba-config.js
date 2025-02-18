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
        return gsap.to(data.current.container, { 
          opacity: 0, 
          duration: 0.3,
          backgroundColor: 'inherit'
        });
      },
      beforeEnter(data) {
        console.log("🏃 beforeEnter započeo");
        window.scrollTo(0, 0);
        initGlobalFunctions(data);
        initPageSpecificFunctions(data.next.namespace);
        gsap.set(data.next.container, { 
          opacity: 0,
          backgroundColor: 'inherit'
        });
      },
      enter(data) {
        console.log("🎯 Enter započeo");
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
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

initBarba();