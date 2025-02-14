function initGrid() {
  const max_photos = 30; // Upravljamo brojem fotografija ovdje
  const allPhotoContainers = Array.from(document.querySelectorAll(".photo-container"));
  const photoContainers = allPhotoContainers.slice(0, max_photos);
  
  // Sakrij ostale fotke iz CMS koje nisu u našem odabranom setu
  allPhotoContainers.slice(max_photos).forEach(container => {
    container.style.display = 'none';
  });

  // Funkcija za miješanje redoslijeda
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const shuffledPhotos = shuffleArray([...photoContainers]);

  const leftColumns = [2, 3];
  const rightColumns = [8, 9];

  let isLeft = true;
  let currentRow = 1;
  let lastLeftCol = null;
  let lastRightCol = null;

  shuffledPhotos.forEach((container) => {
    const photo = container.querySelector(".photo");
    const isHorizontal = photo.naturalWidth > photo.naturalHeight;
    const colSpan = isHorizontal ? 3 : 2;

    let startCol;
    if (isLeft) {
      do {
        startCol = leftColumns[Math.floor(Math.random() * leftColumns.length)];
      } while (startCol === lastLeftCol);
      lastLeftCol = startCol;
    } else {
      do {
        startCol = rightColumns[Math.floor(Math.random() * rightColumns.length)];
      } while (startCol === lastRightCol);
      lastRightCol = startCol;
    }

    const endCol = startCol + colSpan;
    container.style.gridColumnStart = startCol;
    container.style.gridColumnEnd = endCol;
    container.style.gridRowStart = currentRow;

    isLeft = !isLeft;
    currentRow++;
  });

  // Spremamo redoslijed kako bi modal znao koji je redoslijed na stranici
  window.shuffledPhotos = shuffledPhotos;

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

  // Inicijaliziraj modal nakon što su shuffledPhotos postavljeni
  if (typeof initPhotoModal === "function") {
    initPhotoModal();
  }
}

// Inicijalizacija
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGrid);
} else {
  initGrid();
}