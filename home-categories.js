function initHomeCategories() {
  const categories = document.querySelectorAll('.categories-row');

  categories.forEach((category) => {
    // Kada korisnik hovera
    category.addEventListener('mouseenter', () => {
      // Smanji opacity za sve ostale kategorije
      gsap.to(categories, {
        opacity: 0.1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Postavi hoverani element na puni opacity
      gsap.to(category, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Smanji opacity slike na nehoveranim elementima
      categories.forEach((cat) => {
        const image = cat.querySelector('.categories-photo');
        if (cat !== category) {
          gsap.to(image, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      // Postavi hoveranu sliku na puni opacity
      const image = category.querySelector('.categories-photo');
      gsap.to(image, {
        opacity: 1,
        height: 300,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Prikaži CTA za hoverani element
      const cta = category.querySelector('.cta');
      gsap.to(cta, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });
    });

    // Kada korisnik makne hover
    category.addEventListener('mouseleave', () => {
      // Vrati opacity svih kategorija na normalno
      gsap.to(categories, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      // Vrati vrijednost svih slika na početak
      categories.forEach((cat) => {
        const image = cat.querySelector('.categories-photo');
        gsap.to(image, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: 'power1.out',
        });
      });

      // Sakrij CTA
      const cta = category.querySelector('.cta');
      gsap.to(cta, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.out',
      });
    });
  });
}