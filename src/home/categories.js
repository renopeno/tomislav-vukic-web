function initCategories() {
  console.log('🎨 Inicijaliziram Categories hover efekte');
  
  const categoryRows = document.querySelectorAll('.categories-row');
  
  console.log(`📦 Pronađeno ${categoryRows.length} category rows`);

  if (categoryRows.length === 0) {
    console.log('⚠️ Nema category rows u DOM-u');
    return;
  }

  categoryRows.forEach((row, index) => {
    const image = row.querySelector('.categories-photo');

    if (!image) {
      console.log(`⚠️ Nema slike u row-u ${index}`);
      return;
    }

    console.log(`✅ Postavljam hover event na row ${index}`);

    gsap.set(image, { 
      scale: 1.1,
      opacity: 0
    });

    row.addEventListener('mouseenter', () => {
      console.log(`🖱️ Mouse ENTER na row ${index}`);
      gsap.to(image, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    row.addEventListener('mouseleave', () => {
      console.log(`🖱️ Mouse LEAVE na row ${index}`);
      gsap.to(image, {
        scale: 1.1,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  });
  
  console.log('✅ Categories hover efekti postavljeni');
}

window.initCategories = initCategories;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategories);
} else {
  initCategories();
}