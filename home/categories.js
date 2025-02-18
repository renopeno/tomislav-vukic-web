function initCategories() {
  const categories = document.querySelectorAll('.categories-row');

  if (!categories.length) {
    console.warn('Categories elements not found.');
    return;
  }

  // Prvo ukloni sve event listenere ako postoje
  categories.forEach((category) => {
    const newCategory = category.cloneNode(true);
    category.replaceWith(newCategory);
  });

  const updatedCategories = document.querySelectorAll('.categories-row');

  updatedCategories.forEach((category) => {
    category.addEventListener('mouseenter', () => {
      gsap.to(updatedCategories, {
        opacity: 0.1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(category, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      updatedCategories.forEach((cat) => {
        const image = cat.querySelector('.categories-photo');
        if (cat !== category) {
          gsap.to(image, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      const image = category.querySelector('.categories-photo');
      gsap.to(image, {
        opacity: 1,
        height: 300,
        duration: 0.3,
        ease: 'power1.out',
      });

      const cta = category.querySelector('.cta');
      gsap.to(cta, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      const titleElement = category.querySelectorAll('.title-l, .cta, .categories-row');
      if (titleElement) {
        createShuffleEffect(titleElement);
      }
    });

    category.addEventListener('mouseleave', () => {
      gsap.to(updatedCategories, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      updatedCategories.forEach((cat) => {
        const image = cat.querySelector('.categories-photo');
        gsap.to(image, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: 'power1.out',
        });
      });

      const cta = category.querySelector('.cta');
      gsap.to(cta, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.out',
      });
    });
  });

  console.log(`📑 Categories initialized, scroll position: ${window.scrollY}px`);
}

initCategories();