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
  
  function initGlobalFunctions() {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    
    if (window.lenis) {
      window.lenis.destroy();
    }
    initLenis?.();
    initLinksHover?.();
    initFooter?.();
    
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
        initHighlights?.();
        initCategories?.();
        break;
      case 'work':
      case 'work-abstract':
      case 'work-nature':
      case 'work-people':
      case 'work-products':
      case 'work-architecture':
        initGrid?.();
        initPhotoModal?.();
        break;
      case 'about':
        initAbout?.();
        break;
    }
  }
  
  let isTransitioning = false;
  
  function createTransitionOverlay() {
    let wrapper = document.querySelector('.transition-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.classList.add('transition-wrapper');
      document.body.appendChild(wrapper);
  
      for (let i = 0; i < 5; i++) {
        const panel = document.createElement('div');
        panel.classList.add('transition-panel');
        wrapper.appendChild(panel);
      }
    }
    return wrapper;
  }
  
  function animatePageOut() {
    return new Promise((resolve) => {
      const wrapper = createTransitionOverlay();
      const panels = wrapper.querySelectorAll('.transition-panel');
  
      gsap.set(wrapper, { position: 'fixed', top: '100vh', left: 0, width: '100%', height: '100vh', zIndex: 9999 });
  
      gsap.set(panels, {
        width: '100%',
        height: '20vh',
        backgroundColor: 'var(--_colors---black)',
        position: 'absolute',
        left: 0,
      });
  
      panels.forEach((panel, index) => {
        gsap.set(panel, { top: `${index * 20}vh` });
      });
  
      // ✅ Ploče zajedno idu prema gore i pokrivaju ekran
      gsap.to(wrapper, {
        top: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: resolve
      });
    });
  }
  
  function animatePageIn(data) {
    return new Promise((resolve) => {
      const panels = document.querySelectorAll('.transition-panel');
      if (!panels.length) return resolve();
  
      // ✅ Osiguravamo da je nova stranica spremna prije reveala
      gsap.set(data.next.container, { opacity: 1 });
  
      // ✅ Ploče nestaju jedna po jedna s efektom
      gsap.to(panels, {
        y: '-100%',
        duration: 1,
        stagger: 0.15,
        ease: 'power3.inOut',
        onComplete: () => {
          document.querySelector('.transition-wrapper').remove();
          resolve();
        }
      });
    });
  }
  
  function initBarba() {
    console.log("📌 Barba.js initialized");
  
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  
    barba.init({
      transitions: [{
        name: 'default-transition',
        leave(data) {
          isTransitioning = true;
          console.log(`🔄 Leaving: ${data.current.namespace}`);
          return animatePageOut();
        },
        beforeEnter(data) {
          if (data.current) {
            destroyPageSpecificFunctions(data.current.namespace);
          }
          
          window.scrollTo(0, 0);
          initGlobalFunctions();
        },
        enter(data) {
          isTransitioning = false;
          console.log(`🎯 Entering: ${data.next.namespace}`);
  
          if (data.next.namespace.includes('work-')) {
            initGrid?.();
            initPhotoModal?.();
          }
          
          updateNavigationWithHref();
          return animatePageIn(data);
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
  
  function initGrid() {
    if (window.isSettingUpGrid || isTransitioning) {
      console.log('🚫 Grid setup already in progress or transition active');
      return;
    }
    
    console.log("✅ Grid initialized");
  }
  
  initBarba();