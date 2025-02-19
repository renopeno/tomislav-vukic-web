let isGridInitializing = false;

function initGrid() {
  if (isGridInitializing || window.isSettingUpGrid) {
    console.log('🚫 Grid initialization already in progress');
    return;
  }
  
  isGridInitializing = true;
  
  try {
    console.log('🎯 initGrid() pokrenut', {
      path: window.location.pathname,
      lastPath: window.lastPath,
      hasShuffledPhotos: !!window.shuffledPhotos,
      isSettingUpGrid: window.isSettingUpGrid
    });

    console.log('🔄 InitGrid call stack:', new Error().stack);

    console.log('🔍 Grid state:', {
      containers: document.querySelectorAll(".photo-container").length,
      shuffled: window.shuffledPhotos?.length || 0,
      currentNamespace: document.querySelector('[data-barba="container"]')?.dataset.namespace
    });

    const MAX_PHOTOS = 30;
    const allPhotoContainers = Array.from(document.querySelectorAll(".photo-container"));
    console.log('📸 Pronađeno fotografija:', allPhotoContainers.length);
    
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

    // Prije shuffle logike:
    console.log('🎲 Shuffle state:', {
      needsShuffle: !window.shuffledPhotos || window.location.pathname !== window.lastPath,
      currentPath: window.location.pathname,
      lastPath: window.lastPath
    });

    // Ako je nova stranica, promiješaj grid
    if (!window.shuffledPhotos || window.location.pathname !== window.lastPath) {
      window.shuffledPhotos = photoContainers.sort(() => Math.random() - 0.5);
      window.lastPath = window.location.pathname;
    }

    // Nakon shuffle logike:
    console.log('🎲 Shuffle complete:', {
      totalPhotos: window.shuffledPhotos?.length,
      firstPhotoId: window.shuffledPhotos?.[0]?.id
    });

    // Prije bilo kakve manipulacije DOM-a:
    console.log('🔍 Pre-manipulation DOM state:', {
      containers: document.querySelectorAll('.photo-container').length,
      visibleContainers: Array.from(document.querySelectorAll('.photo-container')).filter(c => c.style.display !== 'none').length,
      barbaContainer: document.querySelector('[data-barba="container"]')?.dataset.namespace,
      callStack: new Error().stack
    });

    // Nakon što se postavi shuffledPhotos array:
    console.log('🎲 Shuffle result:', {
      originalLength: allPhotoContainers.length,
      shuffledLength: window.shuffledPhotos.length,
      uniqueIds: new Set(window.shuffledPhotos.map(c => c.id)).size
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

    console.log('⚙️ Setup grid config:', {
      width: window.innerWidth,
      config: getCurrentConfig(),
      totalPhotos: window.shuffledPhotos?.length || 0
    });

    function setupGrid() {
      const config = getCurrentConfig();
      let isLeft = true;
      let currentRow = 1;
      let lastLeftCol = null;
      let lastRightCol = null;

      console.log('🛠️ Starting grid setup:', {
        shuffledLength: window.shuffledPhotos?.length,
        domContainers: document.querySelectorAll('.photo-container').length,
        activeNamespace: document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace
      });

      window.shuffledPhotos.forEach((container) => {
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

        container.style.gridColumnStart = startCol;
        container.style.gridColumnEnd = startCol + colSpan;
        container.style.gridRowStart = currentRow;

        isLeft = !isLeft;
        currentRow++;
      });

      console.log('📊 Grid containers state:', {
        visible: Array.from(document.querySelectorAll('.photo-container')).filter(c => c.style.display !== 'none').length,
        hidden: Array.from(document.querySelectorAll('.photo-container')).filter(c => c.style.display === 'none').length,
        shuffled: window.shuffledPhotos?.length
      });

      console.log('📐 Grid setup complete:', {
        visibleContainers: Array.from(document.querySelectorAll('.photo-container')).filter(c => c.style.display !== 'none').length,
        hiddenContainers: Array.from(document.querySelectorAll('.photo-container')).filter(c => c.style.display === 'none').length
      });
    }

    if (!window.isSettingUpGrid) {
      window.isSettingUpGrid = true;
      setupGrid();
      window.isSettingUpGrid = false;
    }

    // Inicijaliziraj modal PRIJE GSAP animacija
    if (typeof initPhotoModal === "function") {
      initPhotoModal();
    }

    // Tranzicija za ulazak fotki u view
    gsap.fromTo(
      window.shuffledPhotos,
      { opacity: 0, scale: 0.8, y: window.innerHeight / 5 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      }
    );

    console.log("✅ Grid postavljen.");
  } finally {
    isGridInitializing = false;
  }
}

// Dodaj ovo u initGrid() ili kao zasebnu funkciju koja se poziva nakon initGrid()
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

// Pozovi je nakon što se grid postavi
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initGrid();
    initCategoryTitleAnimation();
  });
} else {
  initGrid();
  initCategoryTitleAnimation();
}

// Integracija s Barba.js
if (window.barba) {
  barba.hooks.beforeEnter(() => {
    console.log("🔄 Resetiram grid prije tranzicije");
  });

  barba.hooks.after(() => {
    console.log("🔄 Ponovno postavljam grid nakon tranzicije");
    initGrid();
  });
}