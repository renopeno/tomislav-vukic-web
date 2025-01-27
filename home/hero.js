function initHomeHero() {
  let imagesLoaded = 0;

  const heroImage = document.querySelectorAll(".hero-images-container > *");
  const heroTitle = document.querySelector(".hero-title");
  const navbarItems = document.querySelectorAll(".grid-navbar > *");
  const heroFooters = document.querySelectorAll(".hero-footer");
  const preloader = document.querySelector(".preloader");
  const heroImageContainer = document.querySelector(".hero-images-container");
  let heroImages = Array.from(document.querySelectorAll(".hero-image"));

  // Provjera sessionStorage samo za navigaciju
  if (!sessionStorage.getItem("navAnimationShown")) {
      sessionStorage.setItem("navAnimationShown", "true");
      // Sakrij navigaciju na početku
      gsap.set(navbarItems, { y: -20, opacity: 0 });
  }

  // Ponovno dodaj slike u container u nasumičnom redoslijedu
  heroImages.forEach((img) => {
      heroImageContainer.appendChild(img);
  });

  // Ažuriraj niz heroImages nakon promjene u DOM-u
  heroImages = Array.from(document.querySelectorAll(".hero-image"));

  // Randomiziraj fotke u hero stacku
  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }
  shuffleArray(heroImages);

  // Čekaj dok se sve slike ne učitaju
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

  // Ručno razdvoji tekst hero-title na pojedinačna slova
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

  // Selektiraj razdvojena slova
  const characters = heroTitle ? heroTitle.querySelectorAll("span") : [];

  // Postavi slike na random pozicije izvan viewporta
  gsap.set(heroImage, {
      y: window.innerHeight,
      scale: 0,
      rotation: 0,
  });

  // Sakrij footer elemente (početna pozicija)
  gsap.set(heroFooters, { y: 20, opacity: 0 });

  // Sakrij hero-title na početku
  gsap.set(characters, { y: 500 });

  // Funkcija za pokretanje animacije
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
              {
                  y: 0,
                  opacity: 1,
                  duration: 0.4,
                  stagger: 0.25,
                  ease: "power1.out",
              },
              "-=1"
          )
          .to(
              heroFooters,
              {
                  y: 0,
                  opacity: 1,
                  duration: 0.4,
                  stagger: 0.2,
                  ease: "power1.out",
              },
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

  // Parallax efekt za slike
  window.addEventListener("mousemove", (event) => {
      const parallaxFactor = 32; // Maksimalni pomak u pikselima

      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Izračunaj offset u odnosu na centar ekrana
      const offsetX = (clientX - centerX) / centerX;
      const offsetY = (clientY - centerY) / centerY;

      // Pomakni slike prema offsetu
      heroImage.forEach((image, index) => {
          const depth = (index + 5) / heroImage.length; // Različita dubina za svaki sloj
          const moveX = offsetX * parallaxFactor * depth;
          const moveY = offsetY * parallaxFactor * depth;

          // GSAP animacija za glatki efekt
          gsap.to(image, {
              x: moveX,
              y: moveY,
              duration: 0.4, // Tromost animacije
              ease: "power1.out",
          });
      });
  });
}

// Poziv funkcije inicijalizacije prilikom učitavanja stranice
document.addEventListener("DOMContentLoaded", () => {
  initHomeHero();
});