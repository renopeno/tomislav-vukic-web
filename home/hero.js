function initHomeHero() {
  let imagesLoaded = 0;

  const heroImage = document.querySelectorAll(".hero-images-container > *");
  const heroTitle = document.querySelector(".hero-title");
  const navbarItems = document.querySelectorAll(".grid-navbar > *");
  const heroFooters = document.querySelectorAll(".hero-footer");
  const preloader = document.querySelector(".preloader");
  const heroImageContainer = document.querySelector(".hero-images-container");
  let heroImages = Array.from(document.querySelectorAll(".hero-image"));

  if (!sessionStorage.getItem("navAnimationShown")) {
      sessionStorage.setItem("navAnimationShown", "true");
      gsap.set(navbarItems, { y: -20, opacity: 0 });
  }

  heroImages.forEach((img) => {
      heroImageContainer.appendChild(img);
  });

  heroImages = Array.from(document.querySelectorAll(".hero-image"));

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }
  shuffleArray(heroImages);

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

  gsap.set(heroImage, { y: window.innerHeight, scale: 0, rotation: 0 });
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
                  x: () => Math.random() * 150 - 75,
                  y: 0,
                  rotation: () => Math.random() * 40 - 20,
                  scale: 1,
                  duration: 0.8,
                  ease: "power2.out",
                  stagger: 0.2,
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
        // Povećava fleksibilnost za 30% sa svakom fotografijom
        const baseDepth = 1; // Najdonja fotografija
        const depthMultiplier = 1 + index * 0.6; // Svaka sljedeća fotografija povećava fleksibilnost za 30%
        const depth = baseDepth + index * depthMultiplier;

        const moveX = offsetX * parallaxFactor * depth;
        const moveY = offsetY * parallaxFactor * depth;

        gsap.to(image, { x: moveX, y: moveY, duration: 0.4, ease: "power1.out" });
    });
});
  
}

initHomeHero();