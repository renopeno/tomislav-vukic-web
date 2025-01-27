function initPhotoGrid() {
  const photoContainers = Array.from(document.querySelectorAll(".photo-container"));

  // Funkcija za miješanje redoslijeda
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const shuffledPhotos = shuffleArray(photoContainers);

  const leftColumns = [2, 3]; // Moguće početne kolumne za lijevu stranu
  const rightColumns = [7, 8]; // Moguće početne kolumne za desnu stranu

  let isLeft = true; // Praćenje trenutne strane (lijevo/desno)
  let currentRow = 1; // Trenutni red u gridu
  let lastLeftCol = null; // Posljednja odabrana kolona za lijevu stranu
  let lastRightCol = null; // Posljednja odabrana kolona za desnu stranu

  shuffledPhotos.forEach((container) => {
    const photo = container.querySelector(".photo");
    const isHorizontal = photo.naturalWidth > photo.naturalHeight;

    // Koliko kolumni zauzima fotografija
    const colSpan = isHorizontal ? 3 : 2;

    let startCol;
    if (isLeft) {
      // Nasumično odaberi kolonu za lijevu stranu
      do {
        startCol = leftColumns[Math.floor(Math.random() * leftColumns.length)];
      } while (startCol === lastLeftCol); // Izbjegavaj ponavljanje iste kolone zaredom
      lastLeftCol = startCol;
    } else {
      // Nasumično odaberi kolonu za desnu stranu
      do {
        startCol = rightColumns[Math.floor(Math.random() * rightColumns.length)];
      } while (startCol === lastRightCol); // Izbjegavaj ponavljanje iste kolone zaredom
      lastRightCol = startCol;
    }

    const endCol = startCol + colSpan - 1;

    // Postavi pozicije u gridu
    container.style.gridColumnStart = startCol;
    container.style.gridColumnEnd = endCol + 1; // Jedan više zbog grid pravila
    container.style.gridRowStart = currentRow;

    // Prebacivanje na suprotnu stranu (lijevo/desno)
    isLeft = !isLeft;
    currentRow++;
  });

  // GSAP animacija za ulazak fotografija
  gsap.fromTo(
    shuffledPhotos,
    { autoAlpha: 0, scale: 0.8, y: window.innerHeight / 2 },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
  );
}

initPhotoGrid();