/**
 * ═══════════════════════════════════════════════════════════
 *  HERO SECTION - 3D CYLINDER CAROUSEL
 * ═══════════════════════════════════════════════════════════
 */

function initHero() {
  const heroSection = document.querySelector(".section.hero");
  const heroTitle = document.querySelector(".hero-title");
  const heroFooters = document.querySelectorAll(".hero-footer");
  
  if (!heroSection) {
    console.error('❌ Hero sekcija nije pronađena!');
    return;
  }
  
  // Osiguraj da su hero footer linkovi klikabili (iznad canvas-a)
  heroFooters.forEach(footer => {
    footer.style.position = 'relative';
    footer.style.zIndex = '10';
    footer.style.pointerEvents = 'auto';
    
    // Osiguraj da svi child elementi u footeru mogu biti kliknuti
    const links = footer.querySelectorAll('a, button, [role="button"]');
    links.forEach(link => {
      link.style.position = 'relative';
      link.style.zIndex = '11';
      link.style.pointerEvents = 'auto';
    });
  });

  // WEBFLOW CMS STRUKTURA: Svaka slika je u posebnom .hero-images-container
  const heroWrapper = document.querySelector(".hero-images-wrapper");
  
  if (!heroWrapper) {
    console.warn("Hero wrapper nije pronađen!");
    return;
  }

  // Dohvati SVE slike iz svih containera (dinamično iz CMS-a)
  const heroImages = Array.from(document.querySelectorAll(".hero-image"));
  const totalImages = heroImages.length;

  if (totalImages === 0) {
    console.warn("⚠️ Nema slika za prikaz!");
    return;
  }

  // Koristit ćemo PRVI .hero-images-container za canvas
  const heroImageContainer = document.querySelector(".hero-images-container");
  
  // ═══════════════════════════════════════════════════════════
  //  THREE.JS SETUP
  // ═══════════════════════════════════════════════════════════

  if (typeof THREE === 'undefined') {
    console.error("❌ Three.js nije učitan! Provjerite Webflow Footer Code.");
    return;
  }

  // Sakrij SVE originalne Webflow slike
  heroImages.forEach(img => {
    img.style.display = 'none';
  });

  // Pripremi wrapper
  heroWrapper.style.position = 'absolute';
  heroWrapper.style.top = '0';
  heroWrapper.style.left = '0';
  heroWrapper.style.width = '100%';
  heroWrapper.style.height = '100%';
  heroWrapper.style.pointerEvents = 'auto'; // OMOGUĆI pointer events! (bilo: 'none')

  // Pripremi container za canvas
  heroImageContainer.innerHTML = '';
  heroImageContainer.style.position = 'relative';
  heroImageContainer.style.width = '100%';
  heroImageContainer.style.height = '100%';
  heroImageContainer.style.overflow = 'hidden';
  heroImageContainer.style.pointerEvents = 'auto'; // OMOGUĆI pointer events!

  // Kreiraj scenu, kameru, renderer
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    40,
    heroImageContainer.offsetWidth / heroImageContainer.offsetHeight,
    0.1,
    3000
  );
  camera.position.z = 900;
  
  // Na mobilnim uređajima digni carousel (spusti kameru)
  const isMobile = window.innerWidth <= 768;
  camera.position.y = isMobile ? -50 : 0; // Digni carousel na mobitelu

  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(heroImageContainer.offsetWidth, heroImageContainer.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.zIndex = '1'; // Canvas je iza hero footer elemenata (koji su z-index: 10)
  
  heroImageContainer.appendChild(renderer.domElement);

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  directionalLight.position.set(0, 500, 800);
  scene.add(directionalLight);

  // ═══════════════════════════════════════════════════════════
  //  CURVED SHADER ZA CYLINDER EFEKT
  // ═══════════════════════════════════════════════════════════

  const curvedVertexShader = `
    uniform float uBend;
    varying vec2 vUv;
    varying float vBendAmount;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Cylinder bend - zakrivljenje po X-osi
      float bend = pos.x * pos.x * uBend;
      pos.z -= bend;
      
      // Šalji bend amount u fragment shader za lighting
      vBendAmount = bend;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const curvedFragmentShader = `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    varying vec2 vUv;
    varying float vBendAmount;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Shadow na rubovima za naglašavanje benda
      float edgeShadow = 1.0 - smoothstep(0.5, 1.0, abs(vUv.x - 0.5) * 2.0) * 0.25;
      
      // Vignette za dubinu
      vec2 center = vUv - 0.5;
      float vignette = 1.0 - smoothstep(0.3, 0.8, length(center)) * 0.1;
      
      vec3 finalColor = texColor.rgb * edgeShadow * vignette;
      
      gl_FragColor = vec4(finalColor, texColor.a * uOpacity);
    }
  `;


  // ═══════════════════════════════════════════════════════════
  //  UČITAJ SLIKE I KREIRAJ 3D CYLINDER CAROUSEL
  // ═══════════════════════════════════════════════════════════

  const textureLoader = new THREE.TextureLoader();
  const planeMeshes = [];
  const carousel = new THREE.Group();
  scene.add(carousel);

  // Random rotacija odmah (različit svaki reload)
  const randomRotX = Math.random() * 0.4 - 0.2;
  const randomRotZ = Math.random() * 0.4 - 0.2;
  carousel.rotation.x = randomRotX;
  carousel.rotation.z = randomRotZ;

  // Parametri carousela
  const radius = 280; // MANJI radijus = uži carousel
  const planeWidth = 165; // VEĆE za manje slika (bilo 140, sad 8 slika umjesto 10)
  const planeHeight = 185; // Proporcionalno veće (bilo 160)
  const angleStep = (2 * Math.PI) / totalImages;
  
  let loadedCount = 0;
  
  // Pre-allociraj array da zadržimo redoslijed (texture loading je async)
  const planeMeshesTemp = new Array(totalImages);

  heroImages.forEach((img, index) => {
    textureLoader.load(
      img.src,
      (texture) => {
        // PlaneGeometry s MNOGO segmenata za smooth curve
        const geometry = new THREE.PlaneGeometry(
          planeWidth, 
          planeHeight, 
          64, // VIŠE width segments za glatki bend
          1   // height segments
        );

        // Curved shader material
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uBend: { value: 0.0015 }, // Malo jači bend za manji radius
            uOpacity: { value: 0 } // Startuje nevidljivo (reveal animacija)
          },
          vertexShader: curvedVertexShader,
          fragmentShader: curvedFragmentShader,
          transparent: true,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Pozicija u cilindru (FINALNA)
        const angle = -angleStep * index + Math.PI; // Počinje straga
        const finalX = Math.sin(angle) * radius;
        const finalZ = Math.cos(angle) * radius;

        // 🎬 REVEAL: SVE fotke već na pozicijama, ali nevidljive + male
        mesh.position.set(finalX, 30, finalZ);
        mesh.rotation.y = angle;
        
        // Startuju nevidljive + malo manje (fade + scale reveal)
        mesh.material.uniforms.uOpacity.value = 0;
        mesh.scale.set(0.7, 0.7, 0.7); // Malo manje na početku

        carousel.add(mesh);
        planeMeshesTemp[index] = mesh;

        loadedCount++;

        if (loadedCount === totalImages) {
          planeMeshesTemp.forEach(mesh => planeMeshes.push(mesh));
          startAnimation();
        }
      },
      undefined,
      (error) => {
        console.error(`❌ Greška pri učitavanju slike ${index}:`, error);
      }
    );
  });

  // ═══════════════════════════════════════════════════════════
  //  TEXT ANIMACIJA (GSAP)
  // ═══════════════════════════════════════════════════════════

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
  
  gsap.set(heroFooters, { y: 20, opacity: 0 });
  gsap.set(characters, { y: 200, opacity: 0 });

  // ═══════════════════════════════════════════════════════════
  //  REVEAL ANIMACIJA
  // ═══════════════════════════════════════════════════════════

  function startAnimation() {
    const mainTimeline = gsap.timeline();

    // 1. CAROUSEL - prvi što se učitava
    startContinuousRotation(0.008);
    
    planeMeshes.forEach((mesh, index) => {
      const startTime = 0.2 + index * 0.15; // Carousel kreće odmah sa 0.2s delayom
      
      // Fade-in (opacity)
      mainTimeline.to(
        mesh.material.uniforms.uOpacity,
        {
          value: 1,
          duration: 0.6,
          ease: "power1.out"
        },
        startTime
      );
      
      // Scale-up (veličina)
      mainTimeline.to(
        mesh.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
        },
        startTime
      );
    });

    // Izračunaj kad carousel bude skoro gotov (70% završen)
    const carouselRevealEnd = 0.2 + (planeMeshes.length - 1) * 0.15 + 0.6;
    const textStartTime = carouselRevealEnd - 1.2; // Tekstovi kreću RANIJE - 1.2s prije kraja carousela

    // 2. TEKST - dolazi pred kraj carousela (sporije i smooth-ije)
    mainTimeline.to(
      characters,
      {
      y: 0,
      opacity: 1,
      duration: 0.6, // Sporija animacija (bilo 0.3)
        stagger: 0.04, // Malo više stagge za smooth efekt
      ease: "power2.inOut" // Smooth ease in out
      },
      textStartTime
    );

    // 3. FOOTER - dolazi malo nakon teksta
    mainTimeline.to(
      heroFooters,
      {
      y: 0,
      opacity: 1,
      duration: 0.6, // Sporija animacija (bilo 0.4)
      stagger: 0.12,
      ease: "power2.inOut" // Smooth ease in out
      },
      textStartTime + 0.3
    );

    // 4. SMOOTH USPORAVANJE + ROTATING EFEKT
    const revealEndTime = carouselRevealEnd;
    
    // Kreiraj dummy objekt da GSAP može animirati broj (targetRotationSpeed)
    const speedController = { value: 0.008 }; // Početna umjerena brzina
    
    mainTimeline.to(
      speedController,
      {
        value: baseRotationSpeed,
        duration: 2.0,
        ease: "power2.out",
        onUpdate: () => {
          targetRotationSpeed = speedController.value;
        },
        onComplete: () => {
          startFloatingEffect();
        }
      },
      revealEndTime
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  BREATHING EFEKT - Lagano ljuljanje oko random osi
  // ═══════════════════════════════════════════════════════════

  function startFloatingEffect() {
    // Čitaj trenutnu rotaciju (već postavljena random na početku)
    const currentRotX = carousel.rotation.x;
    const currentRotZ = carousel.rotation.z;
    
    // Lagani "breathing" tilt oko trenutne osi (malo se ljulja gore-dolje)
    gsap.to(carousel.rotation, {
      x: currentRotX + 0.03, // Malo jači breathing
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1 // Beskonačno
    });
    
    // Lagani "breathing" tilt (malo se ljulja lijevo-desno)
    gsap.to(carousel.rotation, {
      z: currentRotZ + 0.025, // Malo jači breathing
      duration: 5.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1 // Beskonačno
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  CONTINUOUS ROTATION + SCROLL-DRIVEN SPEED
  // ═══════════════════════════════════════════════════════════

  let baseRotationSpeed = 0.001; // Default brzina
  let currentRotationSpeed = 0;
  let targetRotationSpeed = baseRotationSpeed;
  let maxRotationSpeed = 0.015; // Povećana max brzina za scroll

  function startContinuousRotation(speed) {
    const rotationSpeed = speed !== undefined ? speed : baseRotationSpeed;
    targetRotationSpeed = rotationSpeed;
  }

  // SCROLL-DRIVEN ACCELERATION ✨
  let lastScrollY = 0;
  let scrollVelocity = 0;

  // ═══════════════════════════════════════════════════════════
  //  DRAG INTERAKCIJA (miš + touch)
  // ═══════════════════════════════════════════════════════════

  let isDragging = false;
  let dragStartX = 0;
  let dragCurrentX = 0;
  let dragVelocity = 0;
  let previousDragX = 0;
  let autoRotationPaused = false;
  let savedRotationSpeed = 0;

  // Mouse drag handlers
  const mousedownHandler = (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragCurrentX = e.clientX;
    previousDragX = e.clientX;
    dragVelocity = 0;
    
    // Kill any ongoing GSAP tweens za smooth transition
    gsap.killTweensOf(carousel.rotation);
    
    savedRotationSpeed = targetRotationSpeed;
    targetRotationSpeed = 0;
    autoRotationPaused = true;
    
    // Emit custom event za cursor
    window.dispatchEvent(new CustomEvent('hero:drag:start'));
    
    renderer.domElement.style.cursor = 'grabbing';
  };

  const mousemoveHandler = (e) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Spriječi text selection
    
    dragCurrentX = e.clientX;
    const deltaX = dragCurrentX - previousDragX;
    
    carousel.rotation.y += deltaX * 0.0009; // Smanjeno za 70% (0.003 * 0.3 = 0.0009)
    
    dragVelocity = deltaX * 0.0009;
    previousDragX = dragCurrentX;
  };

  const mouseupHandler = () => {
    if (!isDragging) return;
    
    isDragging = false;
    renderer.domElement.style.cursor = 'grab';
    
    // Emit custom event za cursor
    window.dispatchEvent(new CustomEvent('hero:drag:end'));
    
    // Inertia efekt - uvijek se izvršava za smooth nastavak
    const inertiaAmount = dragVelocity * 80; // Povećano sa 40 na 80 za jaču inertiju
    const inertiaDuration = 3.0; // Fiksni duration - uvijek 3s
    
    gsap.to(carousel.rotation, {
      y: carousel.rotation.y + inertiaAmount,
      duration: inertiaDuration,
      ease: "power2.out" // Smooth deceleration
    });
    
    // Smooth tranzicija nazad na auto-rotation (duže čekanje)
    setTimeout(() => {
      if (!isDragging) {
        // Smooth ease umjesto nagle promjene
        gsap.to({ speed: 0 }, {
          speed: savedRotationSpeed,
          duration: 1.0,
          ease: "power2.inOut",
          onUpdate: function() {
            targetRotationSpeed = this.targets()[0].speed;
          },
          onComplete: () => {
            targetRotationSpeed = savedRotationSpeed;
            autoRotationPaused = false;
          }
        });
      }
    }, 2500);
  };

  // Touch drag handlers (desktop/tablet sa touch + mouse)
  const touchstartHandler = (e) => {
    // Na mobilnim uređajima disableaj drag - samo normalna auto-rotacija
    if (isMobile) {
      return;
    }
    
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragCurrentX = e.touches[0].clientX;
    previousDragX = e.touches[0].clientX;
    dragVelocity = 0;
    
    // Kill any ongoing GSAP tweens za smooth transition
    gsap.killTweensOf(carousel.rotation);
    
    savedRotationSpeed = targetRotationSpeed;
    targetRotationSpeed = 0;
    autoRotationPaused = true;
    
    // Emit custom event za cursor
    window.dispatchEvent(new CustomEvent('hero:drag:start'));
  };

  const touchmoveHandler = (e) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Spriječi default touch behavior
    
    dragCurrentX = e.touches[0].clientX;
    const deltaX = dragCurrentX - previousDragX;
    
    carousel.rotation.y += deltaX * 0.0009; // Smanjeno za 70% (0.003 * 0.3 = 0.0009)
    
    dragVelocity = deltaX * 0.0009;
    previousDragX = dragCurrentX;
  };

  const touchendHandler = () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    // Emit custom event za cursor
    window.dispatchEvent(new CustomEvent('hero:drag:end'));
    
    // Inertia efekt - uvijek se izvršava za smooth nastavak
    const inertiaAmount = dragVelocity * 80; // Povećano sa 40 na 80 za jaču inertiju
    const inertiaDuration = 3.0; // Fiksni duration - uvijek 3s
    
    gsap.to(carousel.rotation, {
      y: carousel.rotation.y + inertiaAmount,
      duration: inertiaDuration,
      ease: "power2.out" // Smooth deceleration
    });
    
    // Smooth tranzicija nazad na auto-rotation (duže čekanje)
    setTimeout(() => {
      if (!isDragging) {
        // Smooth ease umjesto nagle promjene
        gsap.to({ speed: 0 }, {
          speed: savedRotationSpeed,
          duration: 1.0,
          ease: "power2.inOut",
          onUpdate: function() {
            targetRotationSpeed = this.targets()[0].speed;
          },
          onComplete: () => {
            targetRotationSpeed = savedRotationSpeed;
            autoRotationPaused = false;
          }
        });
      }
    }, 2500);
  };

  // Attach drag event listeners - SAMO MOUSE (ne touch da ne blokiramo scroll)
  renderer.domElement.addEventListener('mousedown', mousedownHandler);
  window.addEventListener('mousemove', mousemoveHandler);
  window.addEventListener('mouseup', mouseupHandler);
  
  // Cursor + CSS za drag UX (samo desktop)
  renderer.domElement.style.cursor = 'grab';
  renderer.domElement.style.userSelect = 'none';
  renderer.domElement.style.webkitUserSelect = 'none';
  
  // BITNO: omogući normalno scrollanje na svim touch uređajima
  renderer.domElement.style.touchAction = 'auto';

  // ═══════════════════════════════════════════════════════════
  //  INTERSECTION OBSERVER - Pauziraj kad nije u viewportu
  // ═══════════════════════════════════════════════════════════
  
  let isHeroVisible = true;
  
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isHeroVisible = entry.isIntersecting;
    });
  }, {
    threshold: 0, // Reagiraj čim bilo koji pixel hero-a uđe/izađe
    rootMargin: '100px' // Malo buffer zone
  });
  
  heroObserver.observe(heroSection);

  // ═══════════════════════════════════════════════════════════
  //  ANIMATION LOOP - INTEGRIRANO SA GSAP TICKER-OM
  // ═══════════════════════════════════════════════════════════

  const heroTickerCallback = () => {
    // ⚡ Optimizacija: Ne renderaj ako hero nije vidljiv
    if (!isHeroVisible) return;

    // RESPONSIVE transition brzine (brža interpolacija za scroll response!)
    currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.15;

    // Rotiraj cijeli carousel
    carousel.rotation.y += currentRotationSpeed;

    renderer.render(scene, camera);
  };

  // Dodaj hero rendering u GSAP ticker (sinhronizirano sa Lenis-om!)
  gsap.ticker.add(heroTickerCallback);

  // ═══════════════════════════════════════════════════════════
  //  RESPONSIVE RESIZE
  // ═══════════════════════════════════════════════════════════

  function onWindowResize() {
    const width = heroImageContainer.offsetWidth;
    const height = heroImageContainer.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onWindowResize);

  // ═══════════════════════════════════════════════════════════
  //  CLEANUP
  // ═══════════════════════════════════════════════════════════

  // ⚡ THROTTLED SCROLL HANDLER - optimiziran za performanse
  let isScrollHandlerActive = false;
  
  const scrollHandler = () => {
    // Ne reagiraj na scroll ako je drag aktivan
    if (isDragging || autoRotationPaused) return;
    
    // Throttle - preskoči ako već procesiramo scroll
    if (isScrollHandlerActive) return;
    
    isScrollHandlerActive = true;
    
    // Koristi requestAnimationFrame za optimalno procesiranje
    requestAnimationFrame(() => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      // DIREKTNA VEZA: Scroll brzina = Carousel brzina!
      scrollVelocity = Math.min(scrollDelta * 0.0008, maxRotationSpeed);
      
      // Dok scrollaš: koristi scroll velocity
      if (scrollDelta > 0.5) {
        gsap.killTweensOf(carousel.rotation);
        targetRotationSpeed = baseRotationSpeed + scrollVelocity;
      } else {
        targetRotationSpeed = baseRotationSpeed;
      }
      
      lastScrollY = currentScrollY;
      isScrollHandlerActive = false;
    });
  };

  // Passive event listener za bolje performanse
  window.removeEventListener('scroll', scrollHandler);
  window.addEventListener('scroll', scrollHandler, { passive: true });


  window.addEventListener('barba:before-leave', () => {
    // Ukloni hero rendering iz GSAP ticker-a
    gsap.ticker.remove(heroTickerCallback);
    
    // Zaustavi GSAP animacije (rotating efekt + drag inertija)
    gsap.killTweensOf(carousel.rotation);
    
    // Cleanup Intersection Observer
    if (heroObserver) {
      heroObserver.disconnect();
    }
    
    // Cleanup drag handlers
    renderer.domElement.removeEventListener('mousedown', mousedownHandler);
    window.removeEventListener('mousemove', mousemoveHandler);
    window.removeEventListener('mouseup', mouseupHandler);
    
    planeMeshes.forEach(mesh => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (mesh.material.uniforms.uTexture.value) {
          mesh.material.uniforms.uTexture.value.dispose();
        }
        mesh.material.dispose();
      }
    });

    renderer.dispose();
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('scroll', scrollHandler);
  });
}

// Export za Barba.js
window.initHero = initHero;

// Pokreni odmah ako smo na home stranici
if (document.querySelector('.hero-images-container')) {
initHero();
}
