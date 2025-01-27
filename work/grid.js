function initPhotoGrid() {
  const photoContainers = Array.from(document.querySelectorAll(".photo-container"));

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const shuffledPhotos = shuffleArray(photoContainers);

  const leftColumns = [2, 3];
  const rightColumns = [7, 8];

  let isLeft = true;
  let currentRow = 1;

  shuffledPhotos.forEach((container) => {
    const photo = container.querySelector(".photo");
    const isHorizontal = photo.naturalWidth > photo.naturalHeight;

    const colSpan = isHorizontal ? 3 : 2;
    const startCol = isLeft ? leftColumns[0] : rightColumns[0];
    const endCol = startCol + colSpan - 1;

    container.style.gridColumnStart = startCol;
    container.style.gridColumnEnd = endCol + 1;
    container.style.gridRowStart = currentRow;

    isLeft = !isLeft;
    currentRow++;
  });

  gsap.fromTo(
    shuffledPhotos,
    { autoAlpha: 0, scale: 0.8, y: window.innerHeight / 2 },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
  );
}

export { initPhotoGrid };