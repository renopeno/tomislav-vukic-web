function initPhotoGrid() {
    const photoContainers = Array.from(document.querySelectorAll(".photo-container"));
  
    // Funkcija za miješanje redoslijeda
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  
    // Pomiješaj redoslijed fotografija
    const shuffledPhotos = shuffleArray(photoContainers);
  
    const leftColumns = [2, 3]; // Moguće početne kolumne za lijevu stranu
    const rightColumns = [7, 8]; // Moguće početne kolumne za desnu stranu
  
    let isLeft = true; // Pratimo izmjeničnu poziciju lijevo/desno
    let currentRow = 1; // Trenutni red u gridu
    let lastLeftCol = null; // Posljednja početna kolumna za lijevu stranu
    let lastRightCol = null; // Posljednja početna kolumna za desnu stranu
  
    shuffledPhotos.forEach((container) => {
      const photo = container.querySelector(".photo");
      const isHorizontal = photo.naturalWidth > photo.naturalHeight;
  
      // Koliko kolumni zauzima fotografija
      const colSpan = isHorizontal ? 3 : 2;
  
      let startCol;
      if (isLeft) {
        // Lijeva strana
        do {
          startCol = leftColumns[Math.floor(Math.random() * leftColumns.length)];
        } while (startCol === lastLeftCol); // Izbjegni istu kolumnu kao prethodnu
        lastLeftCol = startCol;
      } else {
        // Desna strana
        do {
          startCol = rightColumns[Math.floor(Math.random() * rightColumns.length)];
        } while (startCol === lastRightCol); // Izbjegni istu kolumnu kao prethodnu
        lastRightCol = startCol;
      }
  
      const endCol = startCol + colSpan - 1;
  
      // Dodaj vertikalni offset za dinamiku
      const verticalOffset = Math.random() * 100 - 50;
  
      // Postavi stilove za svaki container
      container.style.gridColumnStart = startCol;
      container.style.gridColumnEnd = endCol + 1; // Jedan više zbog grid pravila
      container.style.gridRowStart = currentRow;
      container.style.marginTop = `${verticalOffset}px`;
  
      // Osvježi izmjeničnu poziciju lijevo/desno
      isLeft = !isLeft;
  
      // Povećaj trenutni red
      currentRow++;
    });
  
    // GSAP ulazna animacija
    gsap.fromTo(
      shuffledPhotos,
      {
        autoAlpha: 0,
        scale: 0.8, // Početno stanje
        y: window.innerHeight / 2, // Početni vertikalni položaj
      },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1, // Stagger efekt za postupno pojavljivanje
        opacity: 1,
      }
    );
  
    // Parallax efekt prilikom skrolanja
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
  
      shuffledPhotos.forEach((container, index) => {
        const speed = 0.15 + index * 0.01; // Različita brzina za svaku fotografiju
        const offset = scrollY * speed;
  
        gsap.to(container, {
          y: offset,
          duration: 0.4,
          ease: "power1.out",
        });
      });
    });
  }
  
  // Pozovi initPhotoGrid na učitavanju stranice
  document.addEventListener("DOMContentLoaded", () => {
    initPhotoGrid();
  });
  
  // Re-inicijalizacija za Barba.js
  document.addEventListener("barba:afterEnter", () => {
    initPhotoGrid();
  });