let isWorkInitializing = false;

async function initWork() {
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
    
    console.log('🔍 Ukupno photo containers:', allPhotoContainers.length);
    
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

    console.log('✅ Reset svih photo containers');

    // Ograniči broj prikazanih fotografija
    const photoContainers = allPhotoContainers.slice(0, MAX_PHOTOS);
    allPhotoContainers.slice(MAX_PHOTOS).forEach(container => {
      container.style.display = 'none';
    });
    
    console.log(`📸 Prikazujem prvih ${MAX_PHOTOS} fotki, sakrivam ${allPhotoContainers.length - MAX_PHOTOS}`);

    // ✅ FIX: UVIJEK uzmi NOVE elemente iz DOM-a, nemoj cachirati stare reference
    // Barba.js zamijeni cijeli container pri navigaciji, stare reference postanu mrtve!
    console.log('🔀 Shuffleam fotke (NOVI DOM elementi nakon Barba tranzicije)');
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
        
        // Debug za prvu 3 fotke
        if (index < 3) {
          console.log(`📸 Foto ${index}: naturalWidth=${photo.naturalWidth}, naturalHeight=${photo.naturalHeight}, isHorizontal=${isHorizontal}`);
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

        // ✅ KLJUČNI FIX: Eksplicitno postavi display da se vidi
        container.style.display = "block";
        container.style.gridColumnStart = startCol;
        container.style.gridColumnEnd = startCol + colSpan;
        container.style.gridRowStart = currentRow;

        isLeft = !isLeft;
        currentRow++;
      });
      
      console.log(`🧪 setupGrid() ZAVRŠEN - postavio ${window.shuffledPhotos.length} containera`);
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
    
    console.log('✅ Sve slike učitane, postavljam grid');
    if (!window.isSettingUpGrid) {
      window.isSettingUpGrid = true;
      setupGrid();
      window.isSettingUpGrid = false;
    }
    
    // Provjeri da li je grid ZAISTA postavljen
    const firstContainer = window.shuffledPhotos[0];
    const parentGrid = document.querySelector('.grid.work');
    
    console.log('🧪 TEST: Prvi container gridColumnStart =', firstContainer.style.gridColumnStart);
    console.log('🧪 TEST: Prvi container gridRowStart =', firstContainer.style.gridRowStart);
    console.log('🧪 TEST: Pri container display =', firstContainer.style.display);
    console.log('🧪 TEST: Parent grid element =', parentGrid);
    console.log('🧪 TEST: Parent display =', window.getComputedStyle(parentGrid).display);
    console.log('🧪 TEST: Parent grid-template-columns =', window.getComputedStyle(parentGrid).gridTemplateColumns);
    
    // Force reflow - ponekad je potrebno
    parentGrid.offsetHeight;
    
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
        onComplete: () => {
          console.log("✅ GSAP animacija ZAVRŠENA - grid bi trebao biti vidljiv");
        }
      }
    );
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

// Postavi funkcije na window (kao Hero i About)
window.initWork = initWork;
window.initCategoryTitleAnimation = initCategoryTitleAnimation;

console.log('📦 work.js module loaded - funkcije spremne na window objektu');
