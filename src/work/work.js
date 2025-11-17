let isWorkInitializing = false;

// Sakrij category title i work-categories-wrapper ODMAH kada se stranica učita da spriječi flash
// SAMO ako postoji category title (category stranice)
function hideCategoryTitleImmediately() {
  const categoryTitle = document.querySelector('.category-title');
  
  if (categoryTitle) {
    // Koristimo inline style da osiguramo da se primijeni odmah, prije bilo kakvog renderinga
    categoryTitle.style.opacity = '0';
    categoryTitle.style.visibility = 'hidden'; // Dodatna zaštita
    
    // Sakrij categories wrapper SAMO ako postoji category title
    const categoriesWrapper = document.querySelector('.work-categories-wrapper');
    if (categoriesWrapper) {
      categoriesWrapper.style.opacity = '0';
      categoriesWrapper.style.visibility = 'hidden';
    }
  }
  // Ako nema category title (work page), wrapper ostaje vidljiv
}

// Pozovi odmah kada se DOM učita
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideCategoryTitleImmediately);
} else {
  hideCategoryTitleImmediately();
}

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

    // ✅ RANDOMIZIRAJ PRIJE postavljanja eager loading!
    // UVIJEK uzmi NOVE elemente iz DOM-a, nemoj cachirati stare reference
    // Barba.js zamijeni cijeli container pri navigaciji, stare reference postanu mrtve!
    window.shuffledPhotos = photoContainers.sort(() => Math.random() - 0.5);
    window.lastPath = window.location.pathname;
    
    // ✅ SADA postavi eager loading na prvih 5 RANDOMIZIRANIH slika
    const FIRST_PHOTOS_COUNT = 5;
    window.shuffledPhotos.forEach((container, index) => {
      const photo = container.querySelector(".photo");
      if (photo) {
        if (index < FIRST_PHOTOS_COUNT) {
          // Prvih 5 RANDOMIZIRANIH - učitaj odmah
          photo.setAttribute("loading", "eager");
          photo.setAttribute("fetchpriority", "high");
        } else {
          // Ostale - lazy load
          photo.setAttribute("loading", "lazy");
        }
        photo.setAttribute("decoding", "async");
      }
    });


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

    function setupGrid(usePlaceholderHeights = false) {
      const config = getCurrentConfig();
      let isLeft = true;
      let currentRow = 1;
      let lastLeftCol = null;
      let lastRightCol = null;

      window.shuffledPhotos.forEach((container, index) => {
        const photo = container.querySelector(".photo");
        
        // ✅ Ako slika još nije učitana, koristi placeholder aspect ratio
        let isHorizontal = false;
        let colSpan = config.verticalSpan;
        
        if (photo.naturalWidth > 0 && photo.naturalHeight > 0) {
          // Slika je učitana - koristi stvarni aspect ratio
          isHorizontal = photo.naturalWidth > photo.naturalHeight;
          colSpan = isHorizontal ? config.horizontalSpan : config.verticalSpan;
        } else if (usePlaceholderHeights) {
          // Slika još nije učitana - koristi placeholder
          // Na mobitelu sve su jedna ispod druge, na desktopu koristimo prosječni aspect ratio
          if (config.columns === 1) {
            // Mobile - sve su vertikalne (1 kolona)
            colSpan = config.verticalSpan;
          } else {
            // Desktop/Tablet - koristi prosječni aspect ratio (pretpostavljamo 4:3)
            // Možemo koristiti placeholder visinu ili čekati da se učitaju
            colSpan = config.verticalSpan; // Default na vertikalno
          }
        }

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
        
        // ✅ Na mobitelu, postavi minimalnu visinu placeholder-a dok se slika ne učita
        if (config.columns === 1 && usePlaceholderHeights && photo.naturalHeight === 0) {
          // Postavi aspect ratio placeholder (pretpostavljamo 4:3 za vertikalne, 16:9 za horizontalne)
          const containerWidth = container.offsetWidth || window.innerWidth;
          const placeholderHeight = containerWidth * 1.33; // 4:3 aspect ratio
          container.style.minHeight = `${placeholderHeight}px`;
        }

        isLeft = !isLeft;
        currentRow++;
      });
    }

    // ✅ POSTAVI GRID ODMAH s placeholder visinama (osobito važno na mobitelu!)
    // Ovo osigurava da grid ima visinu čak i dok se slike učitavaju
    if (!window.isSettingUpGrid) {
      window.isSettingUpGrid = true;
      setupGrid(true); // Postavi grid s placeholder visinama
      window.isSettingUpGrid = false;
    }
    
    // ✅ Čekaj samo prvih 5 slika za početni reveal (ne sve!)
    const firstPhotosCount = 5;
    const firstPhotos = window.shuffledPhotos.slice(0, firstPhotosCount);
    const firstImages = firstPhotos.map(c => c.querySelector('.photo'));
    
    const firstImagePromises = firstImages.map(img => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }
      return new Promise(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve i na error da ne blokira
      });
    });

    // Čekaj samo prvih 5 slika
    await Promise.all(firstImagePromises);
    
    // ✅ Ažuriraj grid nakon što se prvih 5 slika učitaju (da se korigiraju aspect ratio-i)
    if (!window.isSettingUpGrid) {
      window.isSettingUpGrid = true;
      setupGrid(false); // Ažuriraj grid sa stvarnim aspect ratio-ima
      window.isSettingUpGrid = false;
    }
    
    // ✅ Ukloni placeholder min-height nakon što se slike učitaju
    if (getCurrentConfig().columns === 1) {
      firstPhotos.forEach(container => {
        const photo = container.querySelector(".photo");
        if (photo && photo.naturalHeight > 0) {
          container.style.minHeight = '';
        }
      });
    }
    
    // ✅ HYBRID: Prvih 5 fotki delayed reveal, ostale lazy load
    const lazyPhotos = window.shuffledPhotos.slice(firstPhotosCount);
    
    // 1️⃣ PRVIH 5 FOTKI - Delayed reveal s GSAP animacijom (y:50 za sve)
    gsap.fromTo(firstPhotos, 
      { opacity: 0, scale: 0.9, y: 50 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3 // Početni delay
      }
    );
    
    // 2️⃣ OSTALE FOTKE - Lazy load s Intersection Observer
    if (lazyPhotos.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '0px', // Smanjeno sa 100px da se kasnije triggera
        threshold: 0.2 // Povećano threshold - mora biti 20% vidljivo
      };
      
      const photoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animiraj fotku kad uđe u viewport (y:50 za sve)
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
      
      // Postavi početno stanje i počni promatrati lazy fotke (y:50 za sve)
      lazyPhotos.forEach(container => {
        gsap.set(container, { opacity: 0, scale: 0.9, y: 50 });
        photoObserver.observe(container);
      });
      
      // Spremi observer za cleanup
      window.workPhotoObserver = photoObserver;
    }
  } finally {
    isWorkInitializing = false;
  }
  
  // Pokreni category title reveal nakon što se grid postavi
  // Koristimo mali delay da osiguramo da se grid potpuno postavi
  setTimeout(() => {
    initCategoryTitleReveal();
  }, 100);
}

// Reveal animacija za category title (karakter-po-karakter masked reveal)
let isCategoryTitleRevealInitialized = false;

function initCategoryTitleReveal() {
  const categoryTitle = document.querySelector('.category-title');
  
  if (!categoryTitle) {
    return; // Nije category stranica
  }
  
  // Spriječi duplo učitavanje
  if (isCategoryTitleRevealInitialized) {
    return;
  }
  isCategoryTitleRevealInitialized = true;

  gsap.registerPlugin(ScrollTrigger);

  // Osiguraj da je title sakriven (možda je već sakriven inline style-om)
  gsap.set(categoryTitle, { opacity: 0, visibility: 'hidden' });

  // Split text u karaktere (slova) za slovo-po-slovo reveal
  const titleSplit = new SplitType(categoryTitle, { types: 'chars' });

  // Postavi styling za masked reveal efekt
  titleSplit.chars.forEach(char => {
    gsap.set(char, { 
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'top'
    });
  });

  // Wrap svaki karakter u inner span za slide-up efekt
  titleSplit.chars.forEach(char => {
    const text = char.textContent;
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.textContent = text;
    char.textContent = '';
    char.appendChild(inner);
    
    // Inicijalno stanje - sakriveno ispod
    gsap.set(inner, { 
      y: '100%',
      opacity: 0
    });
  });

  // Sakrij work-categories-wrapper dok se title ne animira
  const categoriesWrapper = document.querySelector('.work-categories-wrapper');
  if (categoriesWrapper) {
    gsap.set(categoriesWrapper, { opacity: 0, visibility: 'hidden' });
  }

  // 🎬 CATEGORY TITLE REVEAL - delayed animacija koja se pokreće nakon grid setup-a
  // Delay odgovara grid reveal animaciji (0.3s delay + stagger)
  gsap.to(categoryTitle, { 
    opacity: 1, 
    visibility: 'visible',
    duration: 0 
  }); // Prikaži container odmah
  
  // Timeline za title animaciju
  const titleTimeline = gsap.timeline();
  
  titleTimeline.to(titleSplit.chars.map(c => c.querySelector('span')), {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.03, // Povećano sa 0.015 na 0.03 (30ms između karaktera) za očitiju animaciju
    ease: "power2.out",
    delay: 0.3 // Odgovara delay-u grid reveal animacije
  });
  
  // Animiraj wrapper i njegove iteme paralelno sa gridom i naslovom
  // Kreni 0.1s nakon što krene grid/title animacija (0.3s delay + 0.1s = 0.4s)
  if (categoriesWrapper) {
    // Pronađi sve .category-link elemente unutar wrappera (to su stvarni itemi)
    const categoryLinks = Array.from(categoriesWrapper.querySelectorAll('.category-link'));
    
    if (categoryLinks.length > 0) {
      // Sakrij sve linkove na početku
      categoryLinks.forEach(link => {
        gsap.set(link, { opacity: 0, y: 20 });
      });
      
      // Prikaži wrapper odmah (ali linkovi će se animirati jedan po jedan)
      titleTimeline.to(categoriesWrapper, {
        opacity: 1,
        visibility: 'visible',
        duration: 0
      }, 0.4); // 0.3s (grid delay) + 0.1s = 0.4s
      
      // Animiraj linkove jedan po jedan s laganim delayem - paralelno sa gridom i naslovom
      // Koristimo fromTo za bolju kontrolu i osiguravamo da se animiraju jedan po jedan
      titleTimeline.fromTo(categoryLinks, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1, // 100ms između svakog linka za očitiju animaciju
          ease: "power2.out"
        }, 
        0.4 // Kreni 0.1s nakon grid/title animacije (0.3s + 0.1s)
      );
    } else {
      // Ako nema linkova, samo prikaži wrapper
      titleTimeline.to(categoriesWrapper, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.6,
        ease: "power2.out"
      }, 0.4);
    }
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
  
  // Reset flag za category title reveal da se može ponovno inicijalizirati
  isCategoryTitleRevealInitialized = false;
}

// Postavi funkcije na window
window.initWork = initWork;
window.initCategoryTitleReveal = initCategoryTitleReveal;
window.initCategoryTitleAnimation = initCategoryTitleAnimation;
window.initWorkCategoriesReveal = initWorkCategoriesReveal;
window.cleanupWorkPage = cleanupWorkPage;

// ✅ FALLBACK: Ako smo direktno na work pageu (refresh), pokreni odmah
// Ovo rješava race condition gdje barba-config poziva initWork prije nego je postavljen
function initWorkPageOnRefresh() {
  const isWorkPage = document.querySelector('[data-barba-namespace^="work"]');
  if (isWorkPage && document.querySelectorAll('.photo-container').length > 0) {
    // Pozovi samo ako već nije pokrenut (od strane Barba.js)
    if (!isWorkInitializing) {
      initWork();
      initCategoryTitleReveal(); // Reveal animacija za category title
      initCategoryTitleAnimation();
      initWorkCategoriesReveal();
      
      // ✅ ČEKAJ DA SE PHOTO MODAL UČITA (photo-modal.js se učitava nakon work.js)
      const initPhotoModalWhenReady = () => {
        if (window.initPhotoModal) {
          window.initPhotoModal();
        } else {
          // Retry nakon 50ms ako još nije ready
          setTimeout(initPhotoModalWhenReady, 50);
        }
      };
      
      // Daj malo vremena da se photo-modal.js učita
      setTimeout(initPhotoModalWhenReady, 100);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWorkPageOnRefresh);
} else {
  initWorkPageOnRefresh();
}
