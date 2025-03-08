function initHero() {

  const heroTitle = document.querySelector(".hero-title");
  const navbarItems = document.querySelectorAll(".grid-navbar > *");
  const heroFooters = document.querySelectorAll(".hero-footer");
  const heroImageContainer = document.querySelector(".hero-images-container");
  let heroImages = Array.from(document.querySelectorAll(".hero-image"));

  // Provjeri trebamo li prikazati loader
  const shouldShowLoader = !sessionStorage.getItem("loaderShown") || 
    (window.performance && window.performance.getEntriesByType('navigation')[0]?.type === 'reload');
  
  console.log('📊 Loader status:', { 
    shouldShowLoader, 
    sessionStorage: sessionStorage.getItem("loaderShown"),
    navigationType: window.performance?.getEntriesByType('navigation')[0]?.type 
  });


  // Jednostavni scroll prevention
  if (shouldShowLoader) {

    document.body.classList.add('loader-active');
    document.documentElement.classList.add('loader-active');
    document.body.classList.remove('loader-inactive');
    document.documentElement.classList.remove('loader-inactive');

    // Zaustavi Lenis ako postoji
    if (window.lenis) window.lenis.stop();
  }

  // Uklanjamo navAnimation check jer se navbar uvijek animira nakon loadera
  gsap.set(navbarItems, { y: -20, opacity: 0 });

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
    height: "100%", // Koristi viewport height za punu visinu
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible"
  });

  // Učitaj slike i pokreni animaciju
  let loadedCount = 0;
  console.log('🖼️ Starting to load images, total:', heroImage.length);
  
  heroImage.forEach((img) => {
    const imgElement = new Image();
    imgElement.src = img.src;
    imgElement.onload = () => {
      loadedCount++;
      console.log(`📥 Image loaded (${loadedCount}/${heroImage.length})`);
      if (loadedCount === heroImage.length) {
        console.log('✅ All images loaded, starting animation');
        startAnimation();
      }
    };
    imgElement.onerror = () => {
      loadedCount++;
      console.error(`❌ Image failed to load (${loadedCount}/${heroImage.length})`);
      if (loadedCount === heroImage.length) {
        console.log('⚠️ All images attempted, starting animation despite errors');
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

  // Kreiraj wrapper za svaku sliku za efekt maske
  const heroImageWrappers = [];
  
  heroImage.forEach((img, index) => {
    // Kreiraj wrapper div
    const wrapper = document.createElement('div');
    wrapper.style.width = '120px';
    wrapper.style.height = '120px';
    wrapper.style.position = 'absolute';
    wrapper.style.overflow = 'hidden';
    wrapper.style.left = '50%';
    wrapper.style.top = '50%';
    wrapper.style.transform = 'translate(-50%, -50%)';
    
    // Zamijeni originalnu sliku s wrapperom
    const parent = img.parentNode;
    parent.replaceChild(wrapper, img);
    wrapper.appendChild(img);
    
    img.style.position = 'absolute';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.left = '0'; // Resetiramo left na 0
    img.style.top = '0';  // Resetiramo top na 0
    img.style.opacity = '1';
    img.style.transform = 'translateY(100%)'; // Sakrij sliku ispod
    
    heroImageWrappers.push(wrapper);
  });
  
  gsap.set(heroFooters, { y: 20, opacity: 0 });
  gsap.set(characters, { y: 50, opacity: 0 });
  gsap.set(navbarItems, { y: -20, opacity: 0 });

  // Zastavica za praćenje stanja animacije
  let animationComplete = false;
  
  // Pohrani pozicije slika za parallax
  const imagePositions = [];

  function startAnimation() {
    console.log('🎬 Starting animation sequence');
    
    const mainTimeline = gsap.timeline({
      onComplete: function() {
        console.log('✨ Animation complete');
        animationComplete = true;
        if (shouldShowLoader) {
          enableScroll();
        }
      }
    });
    
    // Loader animacija
    if (shouldShowLoader) {
      console.log('🎭 Starting loader animation');
      mainTimeline.to(heroImage, {
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power4.inOut",
        onStart: () => console.log('📸 Image reveal animation started'),
        onComplete: () => console.log('📸 Image reveal animation complete')
      });
    } else {
      console.log('⏭️ Skipping loader animation');
      gsap.set(heroImage, { y: 0 });
    }
    
    // 2. Transformacija u lepezu
    const lepezaAnim = mainTimeline.to(heroImageWrappers, {
      width: function(index) { return originalStyles[index].width; },
      height: function(index) { return originalStyles[index].height; },
      scale: 1,
      x: (index) => {
        const totalImages = heroImageWrappers.length;
        const spread = window.innerWidth * 0.35;
        const position = (index / (totalImages - 1)) * spread - spread/2;
        imagePositions[index] = position;
        return position;
      },
      y: (index) => {
        const totalImages = heroImageWrappers.length;
        const normalizedIndex = index / (totalImages - 1);
        const arcHeight = -10;
        return 4 * arcHeight * Math.pow(normalizedIndex - 0.5, 2) + arcHeight;
      },
      rotation: (index) => {
        const totalImages = heroImageWrappers.length;
        const startAngle = -25;
        const endAngle = 25;
        return startAngle + (index / (totalImages - 1)) * (endAngle - startAngle);
      },
      duration: 1,
      stagger: 0.05,
      ease: "power3.inOut",
      onStart: function() {
        // Ukloni overflow: hidden s wrappera za glatku transformaciju
        heroImageWrappers.forEach((wrapper, i) => {
          // Postepeno povećavaj wrapper za glatku tranziciju
          gsap.to(wrapper, {
            overflow: 'visible',
            duration: 0.1,
            onComplete: function() {
              // Resetiraj stil slika za transformaciju
              const img = heroImage[i];
              if (img) {
                // Koristi originalne CSS vrijednosti, ALI NE left i top
                img.style.position = originalStyles[i].position;
                img.style.transform = originalStyles[i].transform;
                img.style.objectFit = originalStyles[i].objectFit;
                img.style.maxWidth = originalStyles[i].maxWidth;
                img.style.maxHeight = originalStyles[i].maxHeight;
                // Ne postavljamo left i top jer ih ne želimo koristiti
              }
            }
          });
        });
      }
    });

    // Započni animaciju teksta na 60% lepeza animacije
    mainTimeline.to(characters, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.03,
      ease: "power3.out"
    }, "-=0.6"); // Počni ranije

    mainTimeline.to(heroFooters, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.8"); // Počni u isto vrijeme kad i tekst

    mainTimeline.to(navbarItems, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.8");
  }

  function enableScroll() { 
    
    // Makni CSS klasu za omogucavanje scrolla
    document.body.classList.remove('loader-active');
    document.documentElement.classList.remove('loader-active');
    document.body.classList.add('loader-inactive');
    document.documentElement.classList.add('loader-inactive');
    
    // 3. Pokreni Lenis
    if (window.lenis) {
      try {
        window.lenis.start();
      } catch (e) {
        console.error('Lenis error:', e);
      }
    }
    
    // 4. Spremi u session
    sessionStorage.setItem("loaderShown", "true");
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

    heroImageWrappers.forEach((wrapper, index) => {
      // Povećava fleksibilnost za 30% sa svakom fotografijom
      const baseDepth = 1;
      const depthMultiplier = 1 + index * 0.3;
      const depth = baseDepth * depthMultiplier;

      // Koristi originalnu poziciju iz lepeze kao bazu
      const baseX = imagePositions[index] || 0;
      
      // Dodaj parallax efekt na originalnu poziciju
      const moveX = offsetX * parallaxFactor * depth;
      const moveY = offsetY * parallaxFactor * depth;

      gsap.to(wrapper, { 
        x: baseX + moveX, 
        y: moveY, 
        duration: 0.4, 
        ease: "power1.out" 
      });
    });
  });
}

initHero();