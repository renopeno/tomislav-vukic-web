let isWorkInitializing = false;

async function initWork() {
  if (isWorkInitializing) {
    return;
  }
  isWorkInitializing = true;
  
  const photoContainers = document.querySelectorAll('.photo-container');
  
  if (!photoContainers.length) {
    isWorkInitializing = false;
    return;
  }
  
  try {
    const MAX_PHOTOS = 30;
    const allPhotoContainers = Array.from(document.querySelectorAll(".photo-container"));
    
    // ✅ ODMAH sakrij sve fotke da spriječiš FOUC (Flash of Unstyled Content)
    allPhotoContainers.forEach(container => {
      container.style.opacity = '0';
    });
    
    // Postavi originalParent PRIJE mijenjanja DOM-a
    const gridPhotos = document.querySelectorAll(".photo");
    gridPhotos.forEach(photo => {
      photo.originalParent = photo.parentElement;
    });
    
    // Prvih 6 fotki - eager loading s high priority, ostale lazy
    allPhotoContainers.forEach((container, index) => {
      const photo = container.querySelector(".photo");
      if (photo) {
        if (index < 6) {
          // Prvih 6 - učitaj odmah
          photo.setAttribute("loading", "eager");
          photo.setAttribute("fetchpriority", "high");
        } else {
          // Ostale - lazy load
          photo.setAttribute("loading", "lazy");
        }
        photo.setAttribute("decoding", "async");
      }
    });
    
    // Resetiraj sve postavke
    allPhotoContainers.forEach(container => {
      container.style.display = '';
      container.style.gridColumn = '';
      container.style.gridColumnStart = '';
      container.style.gridColumnEnd = '';
      container.style.gridRowStart = '';
      container.style.transform = '';
    });

    // Ograniči broj prikazanih fotografija
    const photoContainers = allPhotoContainers.slice(0, MAX_PHOTOS);
    allPhotoContainers.slice(MAX_PHOTOS).forEach(container => {
      container.style.display = 'none';
    });

    // UVIJEK uzmi NOVE elemente iz DOM-a, nemoj cachirati stare reference
    // Barba.js zamijeni cijeli container pri navigaciji, stare reference postanu mrtve!
    window.shuffledPhotos = photoContainers.sort(() => Math.random() - 0.5);
    window.lastPath = window.location.pathname;


    // Grid konfiguracija po uređajima
    const gridConfig = {
      desktop: { columns: 12, left: [2, 3], right: [8, 9], horizontalSpan: 3, verticalSpan: 2 },
      tablet: { columns: 8, left: [2, 3], right: [5, 6], horizontalSpan: 3, verticalSpan: 2 },
      mobile: { columns: 1, left: [1], right: [1], horizontalSpan: 1, verticalSpan: 1 }
    };

    function getCurrentConfig() {
      const width = window.innerWidth;
      if (width < 768) return gridConfig.mobile;
      if (width < 992) return gridConfig.tablet;
      return gridConfig.desktop;
    }

    function setupGrid() {
      const config = getCurrentConfig();
      let isLeft = true;
      let currentRow = 1;
      let lastLeftCol = null;
      let lastRightCol = null;

      window.shuffledPhotos.forEach((container, index) => {
        const photo = container.querySelector(".photo");
        const isHorizontal = photo.naturalWidth > photo.naturalHeight;
        const colSpan = isHorizontal ? config.horizontalSpan : config.verticalSpan;

        let startCol;
        if (config.columns === 1) {
          startCol = 1;
        } else {
          if (isLeft) {
            do {
              startCol = config.left[Math.floor(Math.random() * config.left.length)];
            } while (startCol === lastLeftCol);
            lastLeftCol = startCol;
          } else {
            do {
              startCol = config.right[Math.floor(Math.random() * config.right.length)];
            } while (startCol === lastRightCol);
            lastRightCol = startCol;
          }
        }

        container.style.display = "block";
        container.style.gridColumnStart = startCol;
        container.style.gridColumnEnd = startCol + colSpan;
        container.style.gridRowStart = currentRow;

        isLeft = !isLeft;
        currentRow++;
      });
    }

    // Čekaj da sve slike budu učitane prije postavljanja grida
    const allImages = window.shuffledPhotos.map(c => c.querySelector('.photo'));
    const imageLoadPromises = allImages.map(img => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }
      return new Promise(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve i na error da ne blokira
      });
    });

    await Promise.all(imageLoadPromises);
    
    if (!window.isSettingUpGrid) {
      window.isSettingUpGrid = true;
      setupGrid();
      window.isSettingUpGrid = false;
    }
    
    // ✅ LAZY LOAD: Fotke se pojavljuju kako scrollaš pomoću Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: '100px', // Započni animaciju 100px prije nego fotka uđe u viewport
      threshold: 0.1
    };
    
    const photoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animiraj fotku kad uđe u viewport
          gsap.to(entry.target, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          });
          
          // Prestani promatrati nakon reveal-a
          photoObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Postavi početno stanje i počni promatrati sve fotke
    window.shuffledPhotos.forEach(container => {
      gsap.set(container, { opacity: 0, scale: 0.9, y: 50 });
      photoObserver.observe(container);
    });
    
    // Spremi observer za cleanup
    window.workPhotoObserver = photoObserver;
  } finally {
    isWorkInitializing = false;
  }
}

// Dodaj ovo u initWork()  ili kao zasebnu funkciju koja se poziva nakon initWork()
function initCategoryTitleAnimation() {
  const titleWrapper = document.querySelectorAll('.work-categories-title-wrapper, .work-categories-top-margin');
  
  if (!titleWrapper) return;

  gsap.matchMedia().add("(max-width: 767px)", () => {
    gsap.to(titleWrapper, {
      scale: 0.7,
      opacity: 0,
      scrollTrigger: {
        trigger: titleWrapper,
        start: "top top",
        end: "+=200",
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    });
  });
}

// Scroll reveal za kategorije sekciju na work pageu
function initWorkCategoriesReveal() {
  const categoriesSection = document.querySelector('.section.categories');
  
  if (!categoriesSection) return;
  
  // Sakrij kategorije na početku
  gsap.set(categoriesSection, { opacity: 0, y: 60 });
  
  // Reveal kad dođeš do kraja grida
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(categoriesSection, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
        
        // Inicijaliziraj hover efekte nakon reveal-a
        if (window.initCategories) {
          window.initCategories();
        }
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '-100px', // Reveal kad je 100px iznad kraja grida
    threshold: 0.1
  });
  
  revealObserver.observe(categoriesSection);
  
  // Spremi za cleanup
  window.workCategoriesObserver = revealObserver;
}

// Cleanup funkcija za Barba.js tranzicije
function cleanupWorkPage() {
  // Disconnect observers
  if (window.workPhotoObserver) {
    window.workPhotoObserver.disconnect();
    window.workPhotoObserver = null;
  }
  
  if (window.workCategoriesObserver) {
    window.workCategoriesObserver.disconnect();
    window.workCategoriesObserver = null;
  }
}

// Postavi funkcije na window
window.initWork = initWork;
window.initCategoryTitleAnimation = initCategoryTitleAnimation;
window.initWorkCategoriesReveal = initWorkCategoriesReveal;
window.cleanupWorkPage = cleanupWorkPage;

// ✅ FALLBACK: Ako smo direktno na work pageu (refresh), pokreni odmah
// Ovo rješava race condition gdje barba-config poziva initWork prije nego je postavljen
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const isWorkPage = document.querySelector('[data-barba-namespace^="work"]');
    if (isWorkPage && document.querySelectorAll('.photo-container').length > 0) {
      // Pozovi samo ako već nije pokrenut (od strane Barba.js)
      if (!isWorkInitializing) {
        initWork();
        initCategoryTitleAnimation();
        initWorkCategoriesReveal();
      }
    }
  });
} else {
  const isWorkPage = document.querySelector('[data-barba-namespace^="work"]');
  if (isWorkPage && document.querySelectorAll('.photo-container').length > 0) {
    if (!isWorkInitializing) {
      initWork();
      initCategoryTitleAnimation();
      initWorkCategoriesReveal();
    }
  }
}
