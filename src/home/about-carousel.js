/**
 * ═══════════════════════════════════════════════════════════
 *  ABOUT SECTION - 3D CYLINDER CAROUSEL ON HOVER/CLICK
 * ═══════════════════════════════════════════════════════════
 */

console.log('📦📦📦 about-carousel.js FILE SE UČITAVA!');

function initAboutCarousel() {
  console.log('🚀 initAboutCarousel pozvan!');
  
  const barbaContainer = document.querySelector('[data-barba-namespace="home"]');
  
  if (!barbaContainer) {
    console.log('🔍 About Carousel: Nema barba container');
    return;
  }
  
  console.log('✅ Barba container pronađen');

  if (typeof THREE === 'undefined') {
    console.error("❌ Three.js nije učitan! Provjerite Webflow Footer Code.");
    return;
  }

  // Collection mapping
  const collectionMap = {
    'portraits': '.about-carousel-portraits',
    'products': '.about-carousel-products',
    'moments': '.about-carousel-moments'
  };

  // SAKRIJ SVE ORIGINALNE COLLECTIONE ODMAH (ali provjeri da postoje)
  Object.entries(collectionMap).forEach(([type, selector]) => {
    const collection = document.querySelector(selector);
    if (collection) {
      console.log(`✅ Pronađen collection: ${type}`);
      collection.style.display = 'none';
    } else {
      console.warn(`⚠️ Collection nije pronađen: ${selector}`);
    }
  });

  // Dohvati sve .home-about-collection spanove
  // SplitType wrapa spanove u .word i .char elemente, pa možda trebamo tražiti drugačije
  let collectionSpans = document.querySelectorAll('.home-about-collection[data-about-collection]');
  
  console.log(`🔍 Prvi pokušaj: Pronađeno ${collectionSpans.length} .home-about-collection spanova`);
  
  // Ako nema direktnih, probaj pronaći kroz SplitType strukturu
  if (collectionSpans.length === 0) {
    console.log('🔍 Tražim kroz SplitType strukturu...');
    // SplitType wrapa u .word, pa možda trebamo tražiti unutar .word elemenata
    const allWithData = document.querySelectorAll('[data-about-collection]');
    console.log(`🔍 Pronađeno ${allWithData.length} elemenata sa data-about-collection atributom`);
    
    // Probaj pronaći parent span sa klasom .home-about-collection
    allWithData.forEach((el, i) => {
      console.log(`  Element ${i + 1}:`, el.tagName, el.className, 'data:', el.getAttribute('data-about-collection'));
      // Provjeri da li je parent .home-about-collection
      let parent = el.parentElement;
      let depth = 0;
      while (parent && depth < 5) {
        if (parent.classList && parent.classList.contains('home-about-collection')) {
          console.log(`    ✅ Parent je .home-about-collection na depth ${depth}`);
          break;
        }
        parent = parent.parentElement;
        depth++;
      }
    });
    
    collectionSpans = allWithData;
  }
  
  console.log(`🔍 About Carousel: Konačno pronađeno ${collectionSpans.length} collection spanova`);
  collectionSpans.forEach((span, i) => {
    const dataAttr = span.getAttribute('data-about-collection');
    console.log(`  ${i + 1}. Element:`, {
      tag: span.tagName,
      classes: span.className,
      data: dataAttr,
      element: span
    });
  });
  
  if (collectionSpans.length === 0) {
    console.warn("⚠️ Nema .home-about-collection elemenata!");
    console.log('🔍 Debug: Provjeravam DOM strukturu...');
    const aboutTitle = document.querySelector('.home-about-title');
    if (aboutTitle) {
      console.log('  .home-about-title pronađen:', aboutTitle);
      console.log('  InnerHTML snippet:', aboutTitle.innerHTML.substring(0, 200));
    }
    return;
  }

  const isMobile = window.innerWidth <= 767;
  const activeCarousels = new Map(); // Map<collectionType, carouselInstance>

  // ═══════════════════════════════════════════════════════════
  //  CURVED SHADER ZA CYLINDER EFEKT (isti kao u herou)
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
    uniform vec2 uImageAspect;  // (width/height, 1.0)
    uniform vec2 uPlaneAspect;  // (width/height, 1.0)
    varying vec2 vUv;
    varying float vBendAmount;

    void main() {
      // Background cover: scale to cover, maintain aspect ratio, crop center
      float imageAspect = uImageAspect.x;
      float planeAspect = uPlaneAspect.x;
      
      vec2 uv = vUv;
      
      if (imageAspect > planeAspect) {
        // Image is wider - crop left/right, zoom X
        float scale = imageAspect / planeAspect;
        uv.x = (uv.x - 0.5) / scale + 0.5;
      } else {
        // Image is taller - crop top/bottom, zoom Y
        float scale = planeAspect / imageAspect;
        uv.y = (uv.y - 0.5) / scale + 0.5;
      }
      
      vec4 texColor = texture2D(uTexture, uv);
      
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
  //  KREIRAJ CAROUSEL ZA JEDAN COLLECTION
  // ═══════════════════════════════════════════════════════════

  function createCarousel(collectionType, spanElement) {
    const collectionSelector = collectionMap[collectionType];
    if (!collectionSelector) {
      console.warn(`⚠️ Nepoznat collection type: ${collectionType}`);
      return null;
    }

    const collectionWrapper = document.querySelector(collectionSelector);
    if (!collectionWrapper) {
      console.warn(`⚠️ Collection wrapper nije pronađen: ${collectionSelector}`);
      return null;
    }

    console.log(`✅ Collection wrapper pronađen za ${collectionType}:`, collectionWrapper);

    // Dohvati sve slike iz collectiona (unutar .about-carousel-wrapper)
    const wrapper = collectionWrapper.querySelector('.about-carousel-wrapper');
    if (!wrapper) {
      console.warn(`⚠️ .about-carousel-wrapper nije pronađen u ${collectionType}`);
      return null;
    }

    const images = Array.from(wrapper.querySelectorAll('.about-carousel-image'));
    console.log(`📸 Pronađeno ${images.length} slika u collectionu ${collectionType}`);
    
    if (images.length === 0) {
      console.warn(`⚠️ Nema slika u collectionu: ${collectionType}`);
      return null;
    }

    // Slike su već sakrivene jer je cijeli collection sakriven

    // Kreiraj container za canvas (pozicioniran iznad span elementa)
    const canvasContainer = document.createElement('div');
    canvasContainer.className = `about-carousel-canvas-container about-carousel-canvas-${collectionType}`;
    
    // Postavi dimenzije (smanjena visina za mali carousel)
    const maxHeight = 160;
    const aspectRatio = 3 / 4; // Pretpostavljamo 3:4 aspect ratio
    const width = maxHeight * aspectRatio;
    const height = maxHeight;
    
    // Postavi CSS - eksplicitno sve da ne bude problema
    canvasContainer.style.position = 'fixed';
    canvasContainer.style.pointerEvents = 'none';
    canvasContainer.style.zIndex = '-1'; // Iza teksta
    canvasContainer.style.opacity = '0';
    canvasContainer.style.transform = 'scale(0.3)';
    canvasContainer.style.transformOrigin = 'center bottom';
    canvasContainer.style.willChange = 'transform, opacity';
    canvasContainer.style.width = `${width}px`;
    canvasContainer.style.height = `${height}px`;
    canvasContainer.style.overflow = 'visible'; // Osiguraj da se vidi
    canvasContainer.style.visibility = 'visible'; // Eksplicitno visible

    console.log(`📦 Canvas container kreiran za ${collectionType}:`, {
      width,
      height,
      styles: canvasContainer.style.cssText
    });

    // Dodaj u body (fixed positioning za smooth scroll)
    document.body.appendChild(canvasContainer);
    console.log(`✅ Canvas container dodan u body`);

    // ═══════════════════════════════════════════════════════════
    //  THREE.JS SETUP
    // ═══════════════════════════════════════════════════════════

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      40,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 250; // Prilagođen z za mali carousel
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    
    canvasContainer.appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(0, 200, 300);
    scene.add(directionalLight);

    // ═══════════════════════════════════════════════════════════
    //  UČITAJ SLIKE I KREIRAJ 3D CYLINDER CAROUSEL
    // ═══════════════════════════════════════════════════════════

    const textureLoader = new THREE.TextureLoader();
    const planeMeshes = [];
    const carousel = new THREE.Group();
    scene.add(carousel);

    // Random rotacija
    const randomRotX = Math.random() * 0.2 - 0.1;
    const randomRotZ = Math.random() * 0.2 - 0.1;
    carousel.rotation.x = randomRotX;
    carousel.rotation.z = randomRotZ;

    // Parametri carousela - jednostavno za mali carousel
    const radius = 60; // Mali radijus za mali carousel
    const planeWidth = 50; // Mala širina za mali carousel
    const planeHeight = 60; // Mala visina za mali carousel
    const angleStep = (2 * Math.PI) / images.length;
    
    console.log(`📐 Parametri carousela za ${images.length} slika:`, {
      radius,
      planeWidth,
      planeHeight,
      angleStep: (angleStep * 180 / Math.PI).toFixed(1) + '°'
    });
    
    let loadedCount = 0;
    const planeMeshesTemp = new Array(images.length);

    images.forEach((img, index) => {
      // Koristi srcset ako postoji, inače src
      const imageSrc = img.srcset ? img.srcset.split(',')[0].trim().split(' ')[0] : img.src;
      
      if (!imageSrc) {
        console.warn(`⚠️ Slika ${index} nema src ili srcset`);
        return;
      }
      
      textureLoader.load(
        imageSrc,
        (texture) => {
          const imageWidth = texture.image ? texture.image.width : img.naturalWidth || img.width;
          const imageHeight = texture.image ? texture.image.height : img.naturalHeight || img.height;
          
          const imageAspect = imageWidth / imageHeight;
          const planeAspect = planeWidth / planeHeight;
          
          const geometry = new THREE.PlaneGeometry(
            planeWidth, 
            planeHeight, 
            64, // VIŠE segmenata za glatki bend (kao u herou)
            1
          );

          const material = new THREE.ShaderMaterial({
            uniforms: {
              uTexture: { value: texture },
              uBend: { value: 0.0015 }, // Isti bend kao u herou za lijepi zaobljeni krug
              uOpacity: { value: 1 },
              uImageAspect: { value: new THREE.Vector2(imageAspect, 1.0) },
              uPlaneAspect: { value: new THREE.Vector2(planeAspect, 1.0) }
            },
            vertexShader: curvedVertexShader,
            fragmentShader: curvedFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
          });

          const mesh = new THREE.Mesh(geometry, material);

          const angle = -angleStep * index + Math.PI;
          const finalX = Math.sin(angle) * radius;
          const finalZ = Math.cos(angle) * radius;

          mesh.position.set(finalX, 0, finalZ);
          mesh.rotation.y = angle;

          carousel.add(mesh);
          planeMeshesTemp[index] = mesh;

          loadedCount++;

          if (loadedCount === images.length) {
            planeMeshesTemp.forEach(mesh => planeMeshes.push(mesh));
            startRotation();
          }
        },
        undefined,
        (error) => {
          console.error(`❌ Greška pri učitavanju slike ${index}:`, error);
        }
      );
    });

    // ═══════════════════════════════════════════════════════════
    //  AUTO-ROTACIJA
    // ═══════════════════════════════════════════════════════════

    let baseRotationSpeed = 0.001;
    let currentRotationSpeed = 0;
    let targetRotationSpeed = baseRotationSpeed;
    let isVisible = false;
    let mouseLeaveTimeout = null; // Za praćenje mouseleave timeouta

    function startRotation() {
      targetRotationSpeed = baseRotationSpeed;
    }

    const rotationCallback = () => {
      if (!isVisible) return;

      currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.15;
      carousel.rotation.y += currentRotationSpeed;
      renderer.render(scene, camera);
    };

    // Dodaj u GSAP ticker samo kad je vidljiv (optimizacija performansi)
    let tickerAdded = false;
    
    function addTicker() {
      if (!tickerAdded) {
        gsap.ticker.add(rotationCallback);
        tickerAdded = true;
      }
    }
    
    function removeTicker() {
      if (tickerAdded) {
        gsap.ticker.remove(rotationCallback);
        tickerAdded = false;
      }
    }

    // ═══════════════════════════════════════════════════════════
    //  POZICIONIRANJE I ANIMACIJA
    // ═══════════════════════════════════════════════════════════

    function updatePosition() {
      const rect = spanElement.getBoundingClientRect();
      
      // Centriraj preko riječi (fixed positioning - scrolla se skupa)
      const left = rect.left + (rect.width / 2) - (width / 2);
      // Podigni carousel više iznad riječi (dodatnih 40px gore)
      const top = rect.top - (height / 2) + (rect.height / 2) - 64; // 64px iznad centra riječi
      
      canvasContainer.style.left = `${left}px`;
      canvasContainer.style.top = `${top}px`;
      
      console.log(`📍 Update pozicije za ${collectionType}:`, {
        spanRect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        },
        carouselPos: {
          left,
          top,
          width,
          height
        }
      });
    }

    function showCarousel() {
      console.log(`🎬 showCarousel pozvan za ${collectionType}`);
      isVisible = true;
      addTicker();
      updatePosition();
      
      // Dodaj mouseenter/mouseleave na carousel container da spriječi zatvaranje
      // kad miš prelazi preko carousela
      const handleCarouselMouseEnter = () => {
        console.log(`🖱️ Mouseenter u carousel container za ${collectionType}`);
        // Spriječi zatvaranje
        if (mouseLeaveTimeout) {
          clearTimeout(mouseLeaveTimeout);
          mouseLeaveTimeout = null;
        }
      };
      
      const handleCarouselMouseLeave = (e) => {
        console.log(`🖱️ Mouseleave iz carousel container za ${collectionType}`);
        // Provjeri da li je miš stvarno izašao
        if (mouseLeaveTimeout) {
          clearTimeout(mouseLeaveTimeout);
        }
        mouseLeaveTimeout = setTimeout(() => {
          const elementUnderMouse = document.elementFromPoint(
            e.clientX || window.innerWidth / 2,
            e.clientY || window.innerHeight / 2
          );
          
          const isOutsideSpan = !spanElement.contains(elementUnderMouse);
          const isOutsideCarousel = !canvasContainer.contains(elementUnderMouse);
          
          if (isOutsideSpan && isOutsideCarousel && isVisible) {
            isVisible = false;
            removeTicker();
            gsap.to(canvasContainer, {
              opacity: 0,
              scale: 0.3,
              duration: 0.3,
              ease: "power2.in"
            });
          }
          mouseLeaveTimeout = null;
        }, 100);
      };
      
      canvasContainer.addEventListener('mouseenter', handleCarouselMouseEnter);
      canvasContainer.addEventListener('mouseleave', handleCarouselMouseLeave);
      
      // Spremi reference za cleanup
      canvasContainer._carouselMouseEnter = handleCarouselMouseEnter;
      canvasContainer._carouselMouseLeave = handleCarouselMouseLeave;
      
      console.log(`📍 Pozicija carousela:`, {
        left: canvasContainer.style.left,
        top: canvasContainer.style.top,
        width: canvasContainer.style.width,
        height: canvasContainer.style.height,
        opacity: canvasContainer.style.opacity,
        transform: canvasContainer.style.transform,
        zIndex: canvasContainer.style.zIndex
      });
      
      gsap.to(canvasContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
        onStart: () => {
          console.log(`🎬 GSAP animacija započeta za ${collectionType}`);
        },
        onComplete: () => {
          console.log(`✅ GSAP animacija završena za ${collectionType}`);
          console.log(`📍 Finalna pozicija:`, {
            left: canvasContainer.style.left,
            top: canvasContainer.style.top,
            opacity: window.getComputedStyle(canvasContainer).opacity,
            transform: window.getComputedStyle(canvasContainer).transform,
            zIndex: window.getComputedStyle(canvasContainer).zIndex,
            position: window.getComputedStyle(canvasContainer).position
          });
        }
      });

      // Update pozicije dok se scrolla (requestAnimationFrame za smooth performanse)
      let rafId = null;
      const scrollHandler = () => {
        if (!isVisible) return;
        
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            if (isVisible) {
              updatePosition();
            }
            rafId = null;
          });
        }
      };
      
      window.addEventListener('scroll', scrollHandler, { passive: true });
      window.addEventListener('resize', scrollHandler, { passive: true });
      canvasContainer._scrollHandler = scrollHandler;
    }

    function hideCarousel() {
      isVisible = false;
      removeTicker();
      
      // Očisti mouseleave timeout
      if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout);
        mouseLeaveTimeout = null;
      }
      
      gsap.to(canvasContainer, {
        opacity: 0,
        scale: 0.3,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (canvasContainer._scrollHandler) {
            window.removeEventListener('scroll', canvasContainer._scrollHandler);
            window.removeEventListener('resize', canvasContainer._scrollHandler);
          }
        }
      });
    }

    // ═══════════════════════════════════════════════════════════
    //  CLEANUP
    // ═══════════════════════════════════════════════════════════

    function cleanup() {
      isVisible = false;
      removeTicker();
      
      if (canvasContainer._scrollHandler) {
        window.removeEventListener('scroll', canvasContainer._scrollHandler);
        window.removeEventListener('resize', canvasContainer._scrollHandler);
      }
      
      // Ukloni mouse event listenere
      if (canvasContainer._carouselMouseEnter) {
        canvasContainer.removeEventListener('mouseenter', canvasContainer._carouselMouseEnter);
      }
      if (canvasContainer._carouselMouseLeave) {
        canvasContainer.removeEventListener('mouseleave', canvasContainer._carouselMouseLeave);
      }
      
      // Očisti timeout
      if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout);
        mouseLeaveTimeout = null;
      }
      
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
      if (canvasContainer.parentNode) {
        canvasContainer.parentNode.removeChild(canvasContainer);
      }
    }

    return {
      show: showCarousel,
      hide: hideCarousel,
      cleanup: cleanup,
      updatePosition: updatePosition
    };
  }

  // ═══════════════════════════════════════════════════════════
  //  HOVER/CLICK INTERAKCIJA
  // ═══════════════════════════════════════════════════════════

  collectionSpans.forEach(span => {
    const collectionType = span.getAttribute('data-about-collection');
    if (!collectionType) {
      console.warn('⚠️ Span nema data-about-collection atribut');
      return;
    }
    
    console.log(`✅ Postavljam event listenere za: ${collectionType}`);

    let carousel = null;
    let isActive = false;

    // Kreiraj carousel (lazy load - samo kad je potreban)
    function getOrCreateCarousel() {
      if (!carousel) {
        console.log(`🎠 Kreiranje carousela za: ${collectionType}`);
        carousel = createCarousel(collectionType, span);
        if (carousel) {
          activeCarousels.set(collectionType, carousel);
          console.log(`✅ Carousel kreiran za: ${collectionType}`);
        } else {
          console.error(`❌ Neuspješno kreiranje carousela za: ${collectionType}`);
        }
      }
      return carousel;
    }

    // Postavi cursor pointer da se vidi da je klikabilno
    span.style.cursor = 'pointer';
    
    // Desktop: hover
    if (!isMobile) {
      console.log(`📌 Postavljam mouseenter listener za: ${collectionType}`);
      console.log(`  Span element:`, span);
      console.log(`  Span pozicija:`, span.getBoundingClientRect());
      
      span.addEventListener('mouseenter', (e) => {
        console.log(`🖱️ Hover na: ${collectionType}`, e.target);
        console.log(`  Span pozicija na hover:`, span.getBoundingClientRect());
        
        // Zatvori sve ostale carousele prije otvaranja novog
        activeCarousels.forEach((otherCarousel, otherType) => {
          if (otherType !== collectionType && otherCarousel) {
            // Resetiraj active state za druge spanove
            const otherSpan = Array.from(collectionSpans).find(s => 
              s.getAttribute('data-about-collection') === otherType
            );
            if (otherSpan && otherSpan._isActive) {
              otherSpan._isActive = false;
              otherCarousel.hide();
            }
          }
        });
        
        const carouselInstance = getOrCreateCarousel();
        console.log(`  Carousel instance:`, carouselInstance);
        if (carouselInstance && !isActive) {
          isActive = true;
          span._isActive = true;
          console.log(`✅ Prikazujem carousel za: ${collectionType}`);
          carouselInstance.show();
        } else {
          console.warn(`⚠️ Ne mogu prikazati carousel za: ${collectionType}`, { 
            carouselInstance, 
            isActive,
            hasCarousel: !!carouselInstance
          });
        }
      });

      // Poboljšana logika za mouseleave - provjeri da li je miš stvarno izašao
      let mouseLeaveTimeout = null;
      
      span.addEventListener('mouseleave', (e) => {
        console.log(`🖱️ Mouseleave sa: ${collectionType}`);
        
        // Očisti timeout ako postoji
        if (mouseLeaveTimeout) {
          clearTimeout(mouseLeaveTimeout);
        }
        
        // Provjeri da li je miš stvarno izašao nakon kratke delay
        mouseLeaveTimeout = setTimeout(() => {
          // Provjeri element ispod miša
          const elementUnderMouse = document.elementFromPoint(
            e.clientX || (e.relatedTarget ? 0 : window.innerWidth / 2),
            e.clientY || (e.relatedTarget ? 0 : window.innerHeight / 2)
          );
          
          // Provjeri da li je miš izvan span elementa i carousel containera
          const isOutsideSpan = !span.contains(e.relatedTarget);
          const carouselContainer = document.querySelector(`.about-carousel-canvas-${collectionType}`);
          const isOutsideCarousel = !carouselContainer || !carouselContainer.contains(e.relatedTarget);
          
          if (isOutsideSpan && isOutsideCarousel && carousel && isActive) {
            isActive = false;
            span._isActive = false;
            carousel.hide();
          }
          
          mouseLeaveTimeout = null;
        }, 100); // Kratka delay da se provjeri gdje je miš
      });
      
      // Također dodaj mouseenter na carousel container da spriječi zatvaranje
      // Ovo će se dodati nakon što se carousel kreira
    } else {
      // Mobile: click toggle
      span.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log(`📱 Click na: ${collectionType}`);
        const carouselInstance = getOrCreateCarousel();
        if (!carouselInstance) {
          console.warn(`⚠️ Nije moguće kreirati carousel za: ${collectionType}`);
          return;
        }

        if (isActive) {
          // Zatvori
          isActive = false;
          carouselInstance.hide();
        } else {
          // Zatvori sve ostale carousele
          activeCarousels.forEach((otherCarousel, otherType) => {
            if (otherType !== collectionType && otherCarousel) {
              // Resetiraj active state za druge spanove
              const otherSpan = Array.from(collectionSpans).find(s => 
                s.getAttribute('data-about-collection') === otherType
              );
              if (otherSpan && otherSpan._isActive) {
                otherSpan._isActive = false;
                otherCarousel.hide();
              }
            }
          });
          
          // Otvori ovaj
          isActive = true;
          span._isActive = true;
          carouselInstance.show();
        }
      });

      // Zatvori kad se klikne negdje drugdje
      document.addEventListener('click', (e) => {
        if (!span.contains(e.target) && isActive) {
          const carouselInstance = activeCarousels.get(collectionType);
          if (carouselInstance) {
            isActive = false;
            span._isActive = false;
            carouselInstance.hide();
          }
        }
      });
    }

    // Update pozicije na resize (već se rješava u showCarousel)
  });

  // ═══════════════════════════════════════════════════════════
  //  CLEANUP NA BARBA TRANSITION
  // ═══════════════════════════════════════════════════════════

  window.addEventListener('barba:before-leave', () => {
    activeCarousels.forEach(carousel => {
      if (carousel && carousel.cleanup) {
        carousel.cleanup();
      }
    });
    activeCarousels.clear();
  });
}

window.initAboutCarousel = initAboutCarousel;

// Direktan poziv - kao about-section.js (bez čekanja)
console.log('📦 about-carousel.js učitan - pokušavam inicijalizirati');

// Pozovi direktno kao about-section.js (bez čekanja na SplitType)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Delay da SplitType ima vremena
    setTimeout(() => {
      console.log('🔄 DOMContentLoaded - pozivam initAboutCarousel');
      initAboutCarousel();
    }, 2000);
  });
} else {
  // Već je DOM spreman
  setTimeout(() => {
    console.log('🔄 DOM već spreman - pozivam initAboutCarousel');
    initAboutCarousel();
  }, 2000);
}

