function initCategories() {
  const categoryRows = document.querySelectorAll('.categories-row');

  categoryRows.forEach((row) => {
    const image = row.querySelector('.categories-photo');

    if (!image) return;

    gsap.set(image, { 
      scale: 1.1,
      opacity: 0
    });

    row.addEventListener('mouseenter', () => {
      gsap.to(image, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    row.addEventListener('mouseleave', () => {
      gsap.to(image, {
        scale: 1.1,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  });
}

window.initCategories = initCategories;
initCategories();