// LENIS POTPUNO ISKLJUČEN - testiranje sa native scroll-om
function initLenis() {
  console.log('⚠️ LENIS COMPLETELY DISABLED - using native scroll');
  
  // Postavi placeholder da Barba ne javi error
  window.lenis = {
    scroll: 0,
    scrollTo: () => {},
    start: () => {},
    stop: () => {},
    destroy: () => {}
  };
  
  return;
}

window.initLenis = initLenis;
initLenis();