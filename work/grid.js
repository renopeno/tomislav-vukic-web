function initGrid() {
  const photoContainers = Array.from(document.querySelectorAll(".photo-container"));
  let currentRow = 1;

  // Funkcija za miješanje redoslijeda
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // Randomiziraj redoslijed
  const shuffledPhotos = shuffleArray([...photoContainers]);

  const leftColumns = [2, 3];
  const rightColumns = [7, 8];

  let isLeft = true;
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

    const endCol = startCol + colSpan - 1;

    container.style.gridColumnStart = startCol;
    container.style.gridColumnEnd = endCol + 1;
    container.style.gridRowStart = currentRow;

    isLeft = !isLeft;
    currentRow++;
  });

  // GSAP animacija za ulazak fotografija
  gsap.fromTo(
    shuffledPhotos,
    { autoAlpha: 0, scale: 0.8, y: 50 },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
  );

  // Spremi shuffledPhotos u window objekt da ga photo-modal može koristiti
  window.shuffledPhotos = shuffledPhotos;
}

initGrid();