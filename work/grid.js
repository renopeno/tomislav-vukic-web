function initGrid() {
  console.log(`🎯 Pokrećem initGrid() za: ${window.location.pathname}`);

  const MAX_PHOTOS = 30;
  const allPhotoContainers = Array.from(document.querySelectorAll(".photo-container"));

  console.log(`📸 Pronađeno fotografija: ${allPhotoContainers.length}`);

  // Resetiraj sve postavke prije inicijalizacije
  allPhotoContainers.forEach(container => {
    container.style.display = '';
    container.style.gridColumn = '';
    container.style.gridColumnStart = '';
    container.style.gridColumnEnd = '';
    container.style.gridRowStart = '';
    container.style.transform = '';
  });

  // Očisti potencijalno duple inicijalizacije
  if (window.isSettingUpGrid) return;
  window.isSettingUpGrid = true;

  // Ograniči broj prikazanih fotografija
  const photoContainers = allPhotoContainers.slice(0, MAX_PHOTOS);

  // Sakrij ostale fotke
  allPhotoContainers.slice(MAX_PHOTOS).forEach(container => {
    container.style.display = 'none';
  });

  // Funkcija za miješanje redoslijeda
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // Stvori novi shuffled array samo ako ne postoji ili ako se promijenio namespace
  if (!window.shuffledPhotos || window.location.pathname !== window.lastPath) {
    window.shuffledPhotos = shuffleArray([...photoContainers]);
    window.lastPath = window.location.pathname;
  }

  // Responsive grid konfiguracija
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

  setupGrid();
  window.isSettingUpGrid = false;

  // Inicijaliziraj modal PRIJE animacija
  if (typeof initPhotoModal === "function") {
    initPhotoModal();
  }

  // GSAP animacija za ulazak fotografija bez vizualnih skokova
  gsap.fromTo(
    window.shuffledPhotos,
    { opacity: 0, scale: 0.95, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }
  );

  console.log("✅ Grid postavljen.");
}

// Inicijalizacija odmah
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGrid);
} else {
  initGrid();
}

// Integracija s Barba.js
if (window.barba) {
  barba.hooks.beforeEnter(() => {
    document.querySelectorAll(".photo-container").forEach(container => {
      container.style.transition = 'none';
    });
  });

  barba.hooks.after(() => {
    initGrid();
  });
}