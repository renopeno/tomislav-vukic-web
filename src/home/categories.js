function initCategories() {

  const categoriesRow = document.querySelectorAll('.categories-row');
  const categoriesSection = document.querySelector('.section.categories');
  
  // Provjeri postoji li categoriesSection element
  if (!categoriesSection) {
    console.warn('Element .section.categories nije pronađen na stranici');
    return; // Prekini izvršavanje funkcije ako element ne postoji
  }

  categoriesRow.forEach((category) => {
    // Mouse enter
    category.addEventListener('mouseenter', () => {
      // Smanji opacity svih kategorija osim trenutne
      gsap.to(categoriesRow, {
        opacity: 0.1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Vrati opacity trenutnoj kategoriji na 1
      gsap.to(category, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Sakrij slike svih ostalih kategorija
      categoriesRow.forEach((cat) => {
        const image = cat.querySelector('.categories-photo');
        if (cat !== category) {
          gsap.to(image, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      // Prikaži i animiraj sliku trenutne kategorije
      const image = category.querySelector('.categories-photo');
      gsap.to(image, {
        opacity: 1,
        height: 300,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Prikaži CTA (Call to Action) button
      const cta = category.querySelector('.cta');
      gsap.to(cta, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Pokreni shuffle efekt na tekstu naslova i CTA buttonu
      const titleElement = category.querySelector('.title-l');
      const ctaElement = category.querySelector('.cta');
      
      if (titleElement) createShuffleEffect(titleElement, false)();
      if (ctaElement) createShuffleEffect(ctaElement, false)();
    });

    // Mouse leave
    category.addEventListener('mouseleave', () => {
      gsap.to(categoriesRow, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Sakrij sve slike i resetiraj njihovu visinu
      categoriesRow.forEach((cat) => {
        const image = cat.querySelector('.categories-photo');
        gsap.to(image, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: 'power1.out',
        });
      });

      // Sakrij CTA button
      const cta = category.querySelector('.cta');
      gsap.to(cta, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.out',
      });
    });
  });

}

window.initCategories = initCategories;
initCategories();