let isGridInitializing = false;

function initGrid() {
  isGridInitializing = true;
  
  try {
    const MAX_PHOTOS = 30;
    const INITIAL_PHOTOS = 7; // Inicijalno prikazujemo samo 7 fotografija
    const allPhotoContainers = Array.from(document.querySelectorAll(".photo-container"));
    
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

    // Inicijalno prikaži samo prvih INITIAL_PHOTOS fotografija
    window.shuffledPhotos.forEach((container, index) => {
      if (index >= INITIAL_PHOTOS) {
        container.style.display = 'none';
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

    // Inicijaliziraj modal PRIJE GSAP animacija
    if (typeof initPhotoModal === "function") {
      initPhotoModal();
    }

    // Tranzicija za ulazak fotki u view - samo za inicijalno prikazane fotke
    const initialPhotos = window.shuffledPhotos.slice(0, INITIAL_PHOTOS);
    gsap.fromTo(
      initialPhotos,
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

    // Postavi event listener za scroll
    window.addEventListener('scroll', loadMoreOnScroll);
    
    // Provjeri odmah nakon inicijalizacije (za slučaj da je ekran velik)
    setTimeout(loadMoreOnScroll, 500);

    console.log("✅ Grid postavljen s inicijalnih " + INITIAL_PHOTOS + " fotografija.");
  } finally {
    isGridInitializing = false;
  }
}

// Funkcija za učitavanje dodatnih fotografija na scroll
function loadMoreOnScroll() {
  if (isGridInitializing) return;
  
  const BATCH_SIZE = 5; // Broj fotografija koje učitavamo odjednom
  const currentlyLoaded = Array.from(document.querySelectorAll(".photo-container:not([style*='display: none'])")).length;
  
  if (currentlyLoaded >= window.shuffledPhotos.length) {
    window.removeEventListener('scroll', loadMoreOnScroll);
    return;
  }
  
  // Provjeri je li korisnik došao do dna stranice
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const threshold = 300; // Učitaj nove fotografije 300px prije dna
  
  if (scrollPosition > documentHeight - threshold) {
    // Učitaj sljedeću grupu fotografija
    const nextBatch = window.shuffledPhotos.slice(
      currentlyLoaded, 
      Math.min(currentlyLoaded + BATCH_SIZE, window.shuffledPhotos.length)
    );
    
    if (nextBatch.length === 0) return;
    
    // Prikaži fotografije
    nextBatch.forEach(container => {
      container.style.display = '';
    });
    
    // Animiraj nove fotografije
    gsap.fromTo(
      nextBatch,
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
    
    console.log("🔄 Učitano dodatnih " + nextBatch.length + " fotografija.");
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
