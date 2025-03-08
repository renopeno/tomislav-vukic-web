function initCategories() {
  // Dohvati sve category retke iz DOM-a
  const categories = document.querySelectorAll('.categories-row');

  // Ukloni sve postojeće event listenere tako da kloniramo i zamijenimo elemente
  // Ovo je potrebno kako bi se izbjegli dupli event listeneri kod Barba.js tranzicija
  // categories.forEach((category) => {
  //   const newCategory = category.cloneNode(true);
  //   category.replaceWith(newCategory);
  // });

  // Dohvati svježe reference na zamijenjene elemente
  const updatedCategories = document.querySelectorAll('.categories-row');

  updatedCategories.forEach((category) => {
    // Hover IN - Što se događa kad miš uđe u kategoriju
    category.addEventListener('mouseenter', () => {
      // Smanji opacity svih kategorija osim trenutne
      gsap.to(updatedCategories, {
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

    // Hover OUT - Što se događa kad miš izađe iz kategorije
    category.addEventListener('mouseleave', () => {
      // Vrati opacity svim kategorijama na 1
      gsap.to(updatedCategories, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Sakrij sve slike i resetiraj njihovu visinu
      updatedCategories.forEach((cat) => {
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

// Pokreni inicijalizaciju kategorija
initCategories();