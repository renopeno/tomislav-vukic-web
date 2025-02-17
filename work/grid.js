function initGrid() {
  const MAX_PHOTOS = 30;
  const allPhotoContainers = Array.from(document.querySelectorAll(".photo-container"));
  
  // Prvo očisti sve postojeće grid postavke
  allPhotoContainers.forEach(container => {
    // Resetiraj grid svojstva
    container.style.gridColumn = '';
    container.style.gridColumnStart = '';
    container.style.gridColumnEnd = '';
    container.style.gridRowStart = '';
    // Resetiraj display
    container.style.display = '';
  });
  
  const photoContainers = allPhotoContainers.slice(0, MAX_PHOTOS);
  
  // Sakrij ostale fotke
  allPhotoContainers.slice(MAX_PHOTOS).forEach(container => {
    container.style.display = 'none';
  });

  // Funkcija za miješanje redoslijeda
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const shuffledPhotos = shuffleArray([...photoContainers]);

  // Responsive grid konfiguracija
  const gridConfig = {
    desktop: {
      columns: 12,
      left: [2, 3],
      right: [8, 9],
      horizontalSpan: 3,
      verticalSpan: 2
    },
    tablet: {
      columns: 8,
      left: [2, 3],
      right: [5, 6],
      horizontalSpan: 3,
      verticalSpan: 2
    },
    mobile: {
      columns: 1,
      left: [1],
      right: [1],
      horizontalSpan: 1,
      verticalSpan: 1
    }
  };

  // Funkcija koja vraća trenutnu konfiguraciju baziranu na širini ekrana
  function getCurrentConfig() {
    const width = window.innerWidth;
    if (width < 768) return gridConfig.mobile;
    if (width < 992) return gridConfig.tablet;
    return gridConfig.desktop;
  }

  // Funkcija za postavljanje grida
  function setupGrid() {
    const config = getCurrentConfig();
    let isLeft = true;
    let currentRow = 1;
    let lastLeftCol = null;
    let lastRightCol = null;

    shuffledPhotos.forEach((container) => {
      const photo = container.querySelector(".photo");
      const isHorizontal = photo.naturalWidth > photo.naturalHeight;
      const colSpan = isHorizontal ? config.horizontalSpan : config.verticalSpan;

      let startCol;
      if (config.columns === 1) {
        // Mobile layout - jedna kolumna
        startCol = 1;
      } else {
        // Tablet/Desktop layout
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

      const endCol = startCol + colSpan;
      container.style.gridColumnStart = startCol;
      container.style.gridColumnEnd = endCol;
      container.style.gridRowStart = currentRow;

      isLeft = !isLeft;
      currentRow++;
    });
  }

  // Inicijalno postavi grid
  setupGrid();

  // Slušaj resize event
  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Debounce resize event
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupGrid, 250);
  });

  // Spremamo redoslijed kako bi modal znao koji je redoslijed na stranici
  window.shuffledPhotos = shuffledPhotos;

  // Inicijaliziraj modal PRIJE animacija
  if (typeof initPhotoModal === "function") {
    initPhotoModal();
  }

  // GSAP animacija za ulazak fotografija
  gsap.fromTo(
    shuffledPhotos,
    { opacity: 0, scale: 0.8, y: window.innerHeight / 2 },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
    }
  );
}

// Inicijalizacija
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGrid);
} else {
  initGrid();
}

function initializeGrid() {
  const photoContainers = document.querySelectorAll('.photo-container');
  const gridColumns = 12;
  const columnWidth = 2;
  
  photoContainers.forEach((container, index) => {
    // Postavi display na block da se prikaže
    container.style.display = 'block';
    
    // Izračunaj poziciju u gridu
    const column = (index % 3) * 3 + 2; // Rasporedi u 3 stupca, počevši od 2
    const row = Math.floor(index / 3) * 4 + 2; // Razmak između redova
    
    // Postavi grid poziciju
    container.style.gridColumn = `${column} / span ${columnWidth}`;
    container.style.gridRowStart = row;
    
    // Dodaj tranziciju za glatko pojavljivanje
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    // Animiraj pojavljivanje s malim zakašnjenjem za svaku sliku
    setTimeout(() => {
      container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Pokreni inicijalizaciju grida nakon učitavanja DOM-a
document.addEventListener('DOMContentLoaded', initializeGrid);

// Ponovno pokreni grid kada se promijeni ruta (za Barba.js)
if (window.barba) {
  barba.hooks.after(() => {
    initializeGrid();
  });
}