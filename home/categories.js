import gsap from "gsap";

function initHomeCategories() {
  const categories = document.querySelectorAll('.categories-row');

  categories.forEach((category) => {
    category.addEventListener('mouseenter', () => {
      gsap.to(categories, {
        opacity: 0.1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(category, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

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
    });

    category.addEventListener('mouseleave', () => {
      gsap.to(categories, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      });

      categories.forEach((cat) => {
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
}

export { initHomeCategories };