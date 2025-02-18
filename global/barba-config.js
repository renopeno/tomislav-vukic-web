function initBarba() {
  console.log("🚀 Inicijalizacija Barba.js");

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        console.log('👋 Leave započeo:', {
          from: data.current.namespace,
          to: data.next.namespace,
          currentBgColor: getComputedStyle(data.current.container).backgroundColor,
          bodyBgColor: getComputedStyle(document.body).backgroundColor,
          isDarkMode: document.body.classList.contains('ui-dark-mode')
        });
        
        return gsap.to(data.current.container, { opacity: 0, duration: 0.3 });
      },
      beforeEnter(data) {
        console.log('🏃 beforeEnter započeo:', {
          namespace: data.next.namespace,
          containerBgColor: getComputedStyle(data.next.container).backgroundColor,
          bodyBgColor: getComputedStyle(document.body).backgroundColor,
          isDarkMode: document.body.classList.contains('ui-dark-mode')
        });
        
        window.scrollTo(0, 0);
        initGlobalFunctions(data);
        initPageSpecificFunctions(data.next.namespace);
        gsap.set(data.next.container, { opacity: 0 });
      },
      enter(data) {
        console.log('🎯 Enter započeo:', {
          namespace: data.next.namespace,
          containerBgColor: getComputedStyle(data.next.container).backgroundColor,
          bodyBgColor: getComputedStyle(document.body).backgroundColor,
          isDarkMode: document.body.classList.contains('ui-dark-mode')
        });
        
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