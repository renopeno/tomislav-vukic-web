function initFooter() {
  const footer = document.querySelector('.section.footer');
  const previousSection = footer?.previousElementSibling;

  if (previousSection) {
    gsap.to(previousSection, {
      scrollTrigger: {
        trigger: previousSection,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.5}`,
        pin: false,
        scrub: true,
      },
    });

    gsap.to(footer, {
      scrollTrigger: {
        trigger: previousSection,
        start: () => `bottom+=${window.innerHeight * 0.5} bottom`,
        end: 'bottom bottom',
        scrub: true,
      },
    });
  }

  document.querySelectorAll('.section.categories').forEach((section) => {
    gsap.set(section, { zIndex: 1 });
  });
}

initFooter();