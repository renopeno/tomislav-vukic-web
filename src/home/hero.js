/**
 * ═══════════════════════════════════════════════════════════
 *  HERO SECTION - 3D CYLINDER CAROUSEL
 * ═══════════════════════════════════════════════════════════
 * 
 * Features:
 * - Dinamično učitavanje slika iz Webflow CMS-a
 * - 3D cylinder carousel sa zakrivljenim slikama
 * - Continuous rotation oko Y-osi
 * - Minimalni razmak između slika
 * - GSAP reveal animacija
 */

function initHero() {
  const heroTitle = document.querySelector(".hero-title");
  const heroFooters = document.querySelectorAll(".hero-footer");
  
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
  
  console.log(`✅ Pronađeno ${totalImages} slika u CMS-u (bez duplikata)`);

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

  console.log("🎨 Pokrećem 3D Cylinder Carousel...");

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
  
  console.log('🎨 Canvas kreiran i dodan - pointer events OMOGUĆENI!');

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

  // 🎲 RANDOM ROTACIJA ODMAH (različit svaki reload!)
  const randomRotX = Math.random() * 0.4 - 0.2; // -0.2 do 0.2 rad (~±11° range)
  const randomRotZ = Math.random() * 0.4 - 0.2; // -0.2 do 0.2 rad (~±11° range)
  carousel.rotation.x = randomRotX;
  carousel.rotation.z = randomRotZ;
  console.log(`🎲 Random tilt: X=${(randomRotX * 180/Math.PI).toFixed(1)}°, Z=${(randomRotZ * 180/Math.PI).toFixed(1)}°`);

  // Parametri carousela
  const radius = 280; // MANJI radijus = uži carousel
  const planeWidth = 165; // VEĆE za manje slika (bilo 140, sad 8 slika umjesto 10)
  const planeHeight = 185; // Proporcionalno veće (bilo 160)
  const angleStep = (2 * Math.PI) / totalImages;
  
  // 📐 ASPECT RATIO: 165:185 ≈ 0.89:1 (približno 3:4 portrait ratio)
  // Za najbolje rezultate: pripremi fotke u 3:4 ratio (npr: 1200x1600, 900x1200, itd.)
  
  // Debug: izračunaj razmak između slika
  const circumference = 2 * Math.PI * radius; // Obim kruga
  const availableSpacePerImage = circumference / totalImages;
  const gap = availableSpacePerImage - planeWidth;
  console.log(`📏 Obim: ${circumference.toFixed(0)}px, Prostor: ${availableSpacePerImage.toFixed(0)}px, Slika: ${planeWidth}px, Razmak: ${gap.toFixed(0)}px`);

  console.log(`📸 Kreiram 3D cylinder carousel s ${totalImages} slika (PO REDU iz CMS-a)...`);

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
        planeMeshesTemp[index] = mesh; // Spremi na PRAVI index (zadržava redoslijed)

      loadedCount++;
        console.log(`✓ Učitana slika ${loadedCount}/${totalImages} (index: ${index})`);

        if (loadedCount === totalImages) {
          // Kopiraj u pravi planeMeshes array (sada svi u ispravnom redoslijedu)
          planeMeshesTemp.forEach(mesh => planeMeshes.push(mesh));
          console.log(`✅ Sve slike učitane PO REDU iz CMS-a!`);
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
    console.log("🎬 Pokrećem jednostavnu animaciju...");

    const mainTimeline = gsap.timeline();

    // 1. Animiraj tekst
    mainTimeline.to(
      characters,
      {
      y: 0,
      opacity: 1,
      duration: 0.3,
        stagger: 0.03,
      ease: "power3.out"
      },
      0
    );

    // 2. Animiraj footer
    mainTimeline.to(
      heroFooters,
      {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "power3.out"
      },
      0.2
    );

    // 🎬 3. LIJEPI REVEAL: Fotke fade-in + carousel lagano rotira (RANIJE!)
    
    // ODMAH pokreni rotaciju (umjerena brzina)
    startContinuousRotation(0.008); // Brže od normale, ali ne prebrzo
    console.log("🔄 Carousel rotacija pokrenuta za reveal!");
    
    // Fotke fade-in + scale-up (JAKO BRZO - 1.5s ukupno!)
    planeMeshes.forEach((mesh, index) => {
      const startTime = 0.2 + index * 0.15; // Brži stagger (bilo 0.2)
      
      // Fade-in (opacity)
      mainTimeline.to(
        mesh.material.uniforms.uOpacity,
        {
          value: 1,
          duration: 0.6, // JOŠ BRŽE (bilo 0.8)
          ease: "power1.out",
          onComplete: () => {
            console.log(`✓ Slika ${index + 1}/${planeMeshes.length} se pojavila`);
          }
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
          duration: 0.6, // JOŠ BRŽE (bilo 0.8)
          ease: "back.out(1.2)",
        },
        startTime
      );
    });

    // 4. SMOOTH USPORAVANJE + ROTATING EFEKT (ranije počinje usporavanje!)
    const revealEndTime = 0.2 + (planeMeshes.length - 1) * 0.15 + 0.6; // Reveal traje ~1.5s!
    
    // Kreiraj dummy objekt da GSAP može animirati broj (targetRotationSpeed)
    const speedController = { value: 0.008 }; // Početna umjerena brzina
    
    mainTimeline.to(
      speedController,
      {
        value: baseRotationSpeed, // Ciljana default brzina (0.001)
        duration: 2.0, // Smooth prijelaz
        ease: "power2.out",
        onUpdate: () => {
          targetRotationSpeed = speedController.value;
        },
        onComplete: () => {
          console.log("✨ Sve fotke stigle! Default brzina: 0.001 (scroll ga ubrzava 1:1, drag radi!)");
          startFloatingEffect(); // Pokreni breathing efekt nakon reveal-a
        }
      },
      revealEndTime
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  BREATHING EFEKT - Lagano ljuljanje oko random osi
  // ═══════════════════════════════════════════════════════════

  function startFloatingEffect() {
    console.log("🌊 Pokrećem breathing efekt - carousel se lagano ljulja!");
    
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
    // Ako je speed proslijeđen, koristi tu brzinu (za reveal), inače base
    const rotationSpeed = speed !== undefined ? speed : baseRotationSpeed;
    targetRotationSpeed = rotationSpeed;
    console.log(`🔄 Carousel rotacija postavljena na ${rotationSpeed.toFixed(4)} rad/frame`);
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
    console.log('🖱️ Drag započeo');
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
            console.log('🔄 Automatska rotacija nastavljena');
          }
        });
      }
    }, 2500); // Nakon inertia efekta
    
    console.log('🖱️ Drag završio, inertia:', inertiaAmount);
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
    
    console.log('📱 Touch drag započeo');
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
            console.log('🔄 Automatska rotacija nastavljena');
          }
        });
      }
    }, 2500); // Nakon inertia efekta
    
    console.log('📱 Touch drag završio, inertia:', inertiaAmount);
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
  
  console.log('🖱️ Mouse drag aktiviran (desktop), touch scroll omogućen (mobitel/tablet)');

  // ═══════════════════════════════════════════════════════════
  //  ANIMATION LOOP
  // ═══════════════════════════════════════════════════════════

  function animate() {
    requestAnimationFrame(animate);

    // RESPONSIVE transition brzine (brža interpolacija za scroll response!)
    currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.15;

    // Rotiraj cijeli carousel
    carousel.rotation.y += currentRotationSpeed;

    renderer.render(scene, camera);
  }

  animate();

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

  // Store scroll listener za cleanup
  const scrollHandler = () => {
    // Ne reagiraj na scroll ako je drag aktivan
    if (isDragging || autoRotationPaused) return;
    
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    
    // DIREKTNA VEZA: Scroll brzina = Carousel brzina!
    // Što brže scrollaš, to se brže vrti (1:1 mapping)
    scrollVelocity = Math.min(scrollDelta * 0.0008, maxRotationSpeed); // Povećan multiplier za osjetljiviji response
    
    // Dok scrollaš: koristi scroll velocity
    // Kad prestaneš: vrati na base speed
    if (scrollDelta > 0.5) {
      // Kill bilo kakve GSAP tweens kad user počne scrollati (smooth transition iz draga)
      gsap.killTweensOf(carousel.rotation);
      targetRotationSpeed = baseRotationSpeed + scrollVelocity;
    } else {
      targetRotationSpeed = baseRotationSpeed; // Vrati na default
    }
    
    lastScrollY = currentScrollY;
  };

  // Zamijeni inline scroll listener sa named function
  window.removeEventListener('scroll', scrollHandler); // Cleanup prethodni ako postoji
  window.addEventListener('scroll', scrollHandler);


  window.addEventListener('barba:before-leave', () => {
    console.log("🧹 Čistim Three.js resurse...");
    
    // Zaustavi GSAP animacije (rotating efekt + drag inertija)
    gsap.killTweensOf(carousel.rotation);
    
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

  console.log("✅ 3D Cylinder Carousel spreman!");
}

// Export za Barba.js
window.initHero = initHero;

// Pokreni odmah ako smo na home stranici
if (document.querySelector('.hero-images-container')) {
initHero();
}
