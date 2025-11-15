let isWorkInitializing = false;

function initWork() {
  console.log('🔍 initWork() POZVAN!');
  
  if (isWorkInitializing) {
    console.log('⚠️ initWork() već se izvršava, preskačem');
    return;
  }
  isWorkInitializing = true;
  
  // Provjera da znamo da smo na pageu koji ima grid
  const photoContainers = document.querySelectorAll('.photo-container');
  console.log('🔍 Pronađeno photo containers:', photoContainers.length);
  
  if (!photoContainers.length) {
    console.log('⚠️ Nema photo containers - nije work page, izlazim');
    isWorkInitializing = false;
    return;
  }
  
  console.log('✅ Inicijaliziram Work page grid!');
  
  try {
    // DODAJ OVO NA POČETAK - postavi originalParent PRIJE mijenjanja DOM-a
    const gridPhotos = document.querySelectorAll(".photo");
    gridPhotos.forEach(photo => {
      photo.originalParent = photo.parentElement;
    });
    
    const MAX_PHOTOS = 30;
    const allPhotoContainers = Array.from(document.querySelectorAll(".photo-container"));
    
    // Dodaj lazy loading atribute svim fotografijama
    allPhotoContainers.forEach(container => {
      const photo = container.querySelector(".photo");
      if (photo) {
        photo.setAttribute("loading", "lazy");
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


    // Ako je nova stranica, promiješaj grid
    if (!window.shuffledPhotos || window.location.pathname !== window.lastPath) {
      window.shuffledPhotos = photoContainers.sort(() => Math.random() - 0.5);
      window.lastPath = window.location.pathname;
    }


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
    }

    if (!window.isSettingUpGrid) {
      window.isSettingUpGrid = true;
      setupGrid();
      window.isSettingUpGrid = false;
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

window.initWork = initWork;
window.initCategoryTitleAnimation = initCategoryTitleAnimation;

// Inicijaliziraj odmah ili na DOMContentLoaded
console.log('📦 work.js loaded, document.readyState:', document.readyState);
if (document.readyState === 'loading') {
  console.log('⏳ Čekam DOMContentLoaded za work page...');
  document.addEventListener('DOMContentLoaded', () => {
    initWork();
    initCategoryTitleAnimation();
  });
} else {
  console.log('▶️ DOM već loaded, pozivam initWork() i initCategoryTitleAnimation() odmah');
  initWork();
  initCategoryTitleAnimation();
}
