function initHero() {
  let imagesLoaded = 0;

  const heroTitle = document.querySelector(".hero-title");
  const navbarItems = document.querySelectorAll(".grid-navbar > *");
  const heroFooters = document.querySelectorAll(".hero-footer");
  const heroImageContainer = document.querySelector(".hero-images-container");
  let heroImages = Array.from(document.querySelectorAll(".hero-image"));

  if (!sessionStorage.getItem("navAnimationShown")) {
      sessionStorage.setItem("navAnimationShown", "true");
      gsap.set(navbarItems, { y: -20, opacity: 0 });
  }

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }
  
  // Prvo shufflaj array
  shuffleArray(heroImages);
  
  // Zatim očisti container
  heroImageContainer.innerHTML = '';
  
  // Dodaj shufflane slike u container
  heroImages.forEach((img) => {
      heroImageContainer.appendChild(img);
  });
  
  // Ponovno dohvati slike nakon što su dodane u DOM
  const heroImage = document.querySelectorAll(".hero-images-container > *");

  heroImage.forEach((img) => {
      const imgElement = new Image();
      imgElement.src = img.src;
      imgElement.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === heroImage.length) {
              startAnimation();
          }
      };
  });

  function splitTextToSpans(element) {
      if (element) {
          const text = element.textContent.trim();
          element.innerHTML = text
              .split("")
              .map((char) => `<span style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`)
              .join("");
      }
  }
  splitTextToSpans(heroTitle);

  const characters = heroTitle ? heroTitle.querySelectorAll("span") : [];

  // Postavi početne pozicije za lepezu
  gsap.set(heroImage, { 
      x: -100, // Sve slike počinju lijevo
      y: window.innerHeight, 
      scale: 0, 
      rotation: -30 // Početna rotacija za lepezu
  });
  gsap.set(heroFooters, { y: 20, opacity: 0 });
  gsap.set(characters, { y: 500 });

  function startAnimation() {
      const timeline = gsap.timeline();

      timeline
          .to(characters, {
              y: 0,
              duration: 0.5,
              stagger: 0.075,
              ease: "power1.out",
          })
          .to(
              navbarItems,
              { y: 0, opacity: 1, duration: 0.4, stagger: 0.25, ease: "power1.out" },
              "-=1"
          )
          .to(
              heroFooters,
              { y: 0, opacity: 1, duration: 0.4, stagger: 0.2, ease: "power1.out" },
              "-=1"
          )
          .to(
              heroImage,
              {
                  x: (index, target) => {
                      // Rasporedi slike u lepezu s lijeva na desno
                      const totalImages = heroImage.length;
                      const spread = window.innerWidth * 0.6; // Širina lepeze
                      const position = (index / (totalImages - 1)) * spread - spread/2;
                      return position;
                  },
                  y: 0,
                  rotation: (index) => {
                      // Rotacija za efekt lepeze
                      const totalImages = heroImage.length;
                      const startAngle = -30;
                      const endAngle = 30;
                      return startAngle + (index / (totalImages - 1)) * (endAngle - startAngle);
                  },
                  scale: 1,
                  duration: 1.2,
                  ease: "power2.out",
                  stagger: 0.1,
              },
              "-=0.5"
          );
  }

    // Parallax stack photos
    window.addEventListener("mousemove", (event) => {
        const parallaxFactor = 32;

        const { clientX, clientY } = event;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const offsetX = (clientX - centerX) / centerX;
        const offsetY = (clientY - centerY) / centerY;

        heroImage.forEach((image, index) => {
            // Povećava fleksibilnost za 40% sa svakom fotografijom
            const baseDepth = 1; // Najdonja fotografija
            const depthMultiplier = 1 + index * 0.4; // Svaka sljedeća fotografija povećava fleksibilnost za 30%
            const depth = baseDepth + index * depthMultiplier;

            const moveX = offsetX * parallaxFactor * depth;
            const moveY = offsetY * parallaxFactor * depth;

            gsap.to(image, { x: moveX + image._gsap.x, y: moveY, duration: 0.4, ease: "power1.out" });
        });
    });
  
}

initHero();