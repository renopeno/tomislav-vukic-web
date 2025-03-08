function initHero() {
  const heroTitle = document.querySelector(".hero-title");
  const heroFooters = document.querySelectorAll(".hero-footer");
  const heroImageContainer = document.querySelector(".hero-images-container");
  let heroImages = Array.from(document.querySelectorAll(".hero-image"));

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

  // Postavi stil za container da omogući centriranje
  gsap.set(heroImageContainer, {
    position: "relative",
    width: "100%",
    height: "100%", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible"
  });

  // Dodaj varijablu za praćenje učitanih slika
  let loadedCount = 0;
  
  heroImage.forEach((img) => {
    const imgElement = new Image();
    imgElement.src = img.src;
    imgElement.onload = () => {
      loadedCount++;
      if (loadedCount === heroImage.length) {
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

  // Spremi originalne stilove slika prije bilo kakvih promjena
  const originalStyles = [];
  heroImage.forEach((img) => {
    const computedStyle = window.getComputedStyle(img);
    originalStyles.push({
      width: computedStyle.width,
      height: computedStyle.height,
      position: computedStyle.position,
      objectFit: computedStyle.objectFit,
      maxWidth: computedStyle.maxWidth,
      maxHeight: computedStyle.maxHeight,
      transform: computedStyle.transform
    });
  });

  // Pohrani pozicije slika za parallax
  const imagePositions = [];
  
  // Postavi slike direktno bez wrappera
  heroImage.forEach((img) => {
    // Postavi stil direktno na sliku
    img.style.position = 'absolute';
    img.style.objectFit = 'cover';
    img.style.opacity = '1';
    
    // Postavi početnu poziciju za animaciju
    gsap.set(img, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1
    });
  });
  
  gsap.set(heroFooters, { y: 20, opacity: 0 });
  gsap.set(characters, { y: 200, opacity: 0 });

  // Zastavica za praćenje stanja animacije
  let animationComplete = false;

  function startAnimation() {
    const mainTimeline = gsap.timeline({
      onComplete: function() {
        animationComplete = true;
      }
    });
    
    // Transformacija slika u lepezu
    mainTimeline.to(heroImage, {
      x: (index) => {
        const totalImages = heroImage.length;
        const spread = window.innerWidth * 0.35;
        const position = (index / (totalImages - 1)) * spread - spread/2;
        imagePositions[index] = position;
        return position;
      },
      y: (index) => {
        const totalImages = heroImage.length;
        const normalizedIndex = index / (totalImages - 1);
        const arcHeight = -10;
        return 4 * arcHeight * Math.pow(normalizedIndex - 0.5, 2) + arcHeight;
      },
      rotation: (index) => {
        const totalImages = heroImage.length;
        const startAngle = -25;
        const endAngle = 25;
        return startAngle + (index / (totalImages - 1)) * (endAngle - startAngle);
      },
      duration: 1,
      stagger: 0.05,
      ease: "power3.inOut"
    });

    // Započni animaciju teksta na 60% lepeza animacije
    mainTimeline.to(characters, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.05,
      ease: "power3.out"
    }, "-=0.6"); // Počni ranije

    mainTimeline.to(heroFooters, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.8"); // Počni u isto vrijeme kad i tekst
  }

  // Parallax stack photos - poboljšana verzija
  window.addEventListener("mousemove", (event) => {
    // Provjeri je li animacija završena prije nego što primijeniš parallax
    if (!animationComplete) return;
    
    const parallaxFactor = 24;

    const { clientX, clientY } = event;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const offsetX = (clientX - centerX) / centerX;
    const offsetY = (clientY - centerY) / centerY;

    heroImage.forEach((img, index) => {
      // Povećava fleksibilnost za 30% sa svakom fotografijom
      const baseDepth = 1;
      const depthMultiplier = 1 + index * 0.3;
      const depth = baseDepth * depthMultiplier;

      // Koristi originalnu poziciju iz lepeze kao bazu
      const baseX = imagePositions[index] || 0;
      
      // Dodaj parallax efekt na originalnu poziciju
      const moveX = offsetX * parallaxFactor * depth;
      const moveY = offsetY * parallaxFactor * depth;

      gsap.to(img, { 
        x: baseX + moveX, 
        y: moveY, 
        duration: 0.4, 
        ease: "power1.out" 
      });
    });
  });
}

initHero();