function initFooter() {
  const footer = document.querySelector('.section.footer');
  const previousSection = footer?.previousElementSibling;

  gsap.registerPlugin(ScrollTrigger);

  if (previousSection) {
    gsap.to(previousSection, {
      scrollTrigger: {
        trigger: previousSection,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.5}`,
        pin: false,
        scrub: true,
        id: "footer-prev-section",
        onUpdate: (self) => {
          if (self.direction === -1) {
            console.log('🦶 FOOTER (prev) scrolling BACK, progress:', self.progress.toFixed(2));
          }
        }
      },
    });

    gsap.to(footer, {
      scrollTrigger: {
        trigger: previousSection,
        start: () => `bottom+=${window.innerHeight * 0.5} bottom`,
        end: 'bottom bottom',
        scrub: true,
        id: "footer-main",
        onUpdate: (self) => {
          if (self.direction === -1) {
            console.log('🦶 FOOTER (main) scrolling BACK, progress:', self.progress.toFixed(2));
          }
        }
      },
    });

    gsap.set(previousSection, { zIndex: 1 });
  }
}

window.initFooter = initFooter;
initFooter();