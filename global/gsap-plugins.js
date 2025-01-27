function initGsapPlugins() {
    gsap.registerPlugin(Flip, ScrollTrigger, CustomEase); // Globalni `gsap` dostupan putem CDN-a
  }
  
  export { initGsapPlugins };