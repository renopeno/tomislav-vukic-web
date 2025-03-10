export default function initPhotoModal() {

    const modal = document.querySelector(".modal-photo");
    
    // Dodajemo provjeru postojanja modal elementa
    if (!modal) return;
    
    const modalImageContainer = modal.querySelector(".modal-photo-container");
    const modalTitle = modal.querySelector(".modal-title");
    const modalExif = modal.querySelector(".modal-exif");
    const closeButton = modal.querySelector(".modal-close");
    const prevButton = modal.querySelector('[data-photo-nav="previous"]');
    const nextButton = modal.querySelector('[data-photo-nav="next"]');
    const gridPhotos = document.querySelectorAll(".photo");

    gsap.registerPlugin(Flip);

    let currentPhotoIndex = 0;
    let photoData = [];
    let activePhoto = null;

    // Funkcija za tiho scrollanje do fotke u pozadini (dok je modal aktivan)
    function ensurePhotoInViewport(photo) {
        const buffer = 100;
        const photoRect = photo.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetScroll = photoRect.top + scrollTop - buffer;
        window.scrollTo({ top: targetScroll, behavior: "auto" });
    }

    // Inicijalizacija i postavljanje podataka za svaku fotku
    gridPhotos.forEach((photo, index) => {
        // Pronađi pripadajući container iz shuffledPhotos array-a
        const container = window.shuffledPhotos.find(container => container.querySelector('.photo') === photo);
        const actualIndex = window.shuffledPhotos.indexOf(container);

        // Spremi referencu na originalni container direktno u DOM elementu
        photo.originalParent = photo.parentElement;
        photoData[actualIndex] = {
            src: photo.getAttribute("src"),
            title: photo.getAttribute("data-title"),
            exif: photo.getAttribute("data-exif"),
            category: photo.getAttribute("data-category"),
            element: photo, // originalni DOM element
            placeholder: null // placeholder će se kreirati pri premještanju
        };

        photo.addEventListener("click", () => {
            currentPhotoIndex = actualIndex;
            activePhoto = photo;
            openModal(photoData[currentPhotoIndex]);
        });
    });

    function openModal(photo) {
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';
    
        // Snimi FLIP stanje prije promjene
        const state = Flip.getState(photo.element, { props: "all" });
    
        // Kreiraj placeholder u originalnom containeru
        const originalParent = photo.element.originalParent;
        const placeholder = document.createElement("div");
        placeholder.classList.add("photo-placeholder");
        placeholder.style.width = photo.element.offsetWidth + "px";
        placeholder.style.height = photo.element.offsetHeight + "px";
        originalParent.insertBefore(placeholder, photo.element);
        photo.placeholder = placeholder;
    
        // Sakrij grid sadržaj, ali ne i kliknutu fotku
        const gridContent = Array.from(document.querySelectorAll('.photo, .navigation, .navbar, .work-categories-wrapper, .category-title'))
            .filter(el => el !== photo.element);
        gsap.to(gridContent, { opacity: 0, duration: 0.3, ease: "power2.inOut" });
    
        // Dodaj fotku u modal
        modalImageContainer.appendChild(photo.element);
        gsap.set(photo.element, { opacity: 1 });
    
        // Prikaz modala bez boje
        modal.style.display = "grid";
        modal.classList.add("active");
        modal.style.backgroundColor = "transparent"; // Resetiramo na transparent
    
        // Postavi podatke modala
        modalTitle.textContent = photo.title;
        modalExif.textContent = photo.exif;
    
        // Sakrij UI elemente inicijalno
        gsap.set([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20
        });
    
        // FLIP animacija prijelaza slike u modal
        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            absolute: true,
            onComplete: () => {
                // Ako je modal još aktivan, postavi pozadinsku boju
                if (modal.classList.contains("active")) {
                    gsap.to(modal, {
                        backgroundColor: "var(--_colors---off-white)",
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
    
                // Animiraj UI elemente modala
                gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            }
        });
    }

    function closeModal() {
        if (!activePhoto) return;
        if (window.lenis) window.lenis.start();
        document.body.style.overflow = '';
    
        const photo = photoData[currentPhotoIndex];
        const photoElement = photo.element;
        const gridContent = document.querySelectorAll('.photo, .navigation, .navbar, .work-categories-wrapper, .category-title');
    
        // **1. Sakrij pozadinu odmah**
        gsap.set(modal, { backgroundColor: "transparent" });
    
        // **2. Sakrij UI elemente modala**
        gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.in"
        });
    
        // Skrolaj grid do originalne slike
        const originalParent = photoElement.originalParent;
        const originalRect = originalParent.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetScroll = originalRect.top + scrollTop - (window.innerHeight / 2) + (originalRect.height / 2);
        window.scrollTo({ top: targetScroll, behavior: "auto" });
    
        // **3. Pripremi FLIP animaciju**
        const state = Flip.getState(photoElement, { props: "all" });
    
        if (photo.placeholder && originalParent) {
            originalParent.insertBefore(photoElement, photo.placeholder);
            photo.placeholder.remove();
            photo.placeholder = null;
        }
    
        // **4. Izvrši FLIP animaciju povratka**
        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: function () {
                if (this.progress() > 0.7) {
                    gsap.to(gridContent, { opacity: 1, duration: 0.3, ease: "power2.out" });
                }
            },
            onComplete: () => {
                modal.classList.remove("active");
                modal.style.display = "none";
                activePhoto = null;
            }
        });
    }

    function showNextPhoto() {
        const allPhotos = document.querySelectorAll('.photo');
        gsap.killTweensOf(allPhotos);

        let newIndex = (currentPhotoIndex < photoData.length - 1) ? currentPhotoIndex + 1 : 0;
        const currentPhoto = photoData[currentPhotoIndex];
        const nextPhoto = photoData[newIndex];

        // Reset trenutne fotke prije vraćanja u grid
        if (currentPhoto.placeholder && currentPhoto.element.originalParent) {
            gsap.set(currentPhoto.element, {
                x: 0,
                opacity: 1,
                scale: 1,
                rotation: 0
            });
            currentPhoto.element.originalParent.insertBefore(currentPhoto.element, currentPhoto.placeholder);
            currentPhoto.placeholder.remove();
            currentPhoto.placeholder = null;
        }

        const gridPhotos = Array.from(document.querySelectorAll('.photo'))
            .filter(el => el !== nextPhoto.element);
        gsap.set(gridPhotos, { opacity: 0 });

        const origParent = nextPhoto.element.originalParent;
        const placeholder = document.createElement("div");
        placeholder.classList.add("photo-placeholder");
        placeholder.style.width = nextPhoto.element.offsetWidth + "px";
        placeholder.style.height = nextPhoto.element.offsetHeight + "px";
        origParent.insertBefore(placeholder, nextPhoto.element);
        nextPhoto.placeholder = placeholder;

        ensurePhotoInViewport(nextPhoto.element);

        modalImageContainer.innerHTML = "";
        modalImageContainer.appendChild(nextPhoto.element);
        
        // Nova tranzicija koja prati swipe pokret
        gsap.set(nextPhoto.element, {
            opacity: 1,
            x: '100%',
            scale: 0.95,
            rotation: 3
        });

        gsap.to(nextPhoto.element, {
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out"
        });

        modalTitle.textContent = nextPhoto.title;
        modalExif.textContent = nextPhoto.exif;
        activePhoto = nextPhoto.element;
        currentPhotoIndex = newIndex;
    }

    function showPreviousPhoto() {
        const allPhotos = document.querySelectorAll('.photo');
        gsap.killTweensOf(allPhotos);

        let newIndex = (currentPhotoIndex > 0) ? currentPhotoIndex - 1 : photoData.length - 1;
        const currentPhoto = photoData[currentPhotoIndex];
        const prevPhoto = photoData[newIndex];

        // Reset trenutne fotke prije vraćanja u grid
        if (currentPhoto.placeholder && currentPhoto.element.originalParent) {
            gsap.set(currentPhoto.element, {
                x: 0,
                opacity: 1,
                scale: 1,
                rotation: 0
            });
            currentPhoto.element.originalParent.insertBefore(currentPhoto.element, currentPhoto.placeholder);
            currentPhoto.placeholder.remove();
            currentPhoto.placeholder = null;
        }

        const gridPhotos = Array.from(document.querySelectorAll('.photo'))
            .filter(el => el !== prevPhoto.element);
        gsap.set(gridPhotos, { opacity: 0 });

        const origParent = prevPhoto.element.originalParent;
        const placeholder = document.createElement("div");
        placeholder.classList.add("photo-placeholder");
        placeholder.style.width = prevPhoto.element.offsetWidth + "px";
        placeholder.style.height = prevPhoto.element.offsetHeight + "px";
        origParent.insertBefore(placeholder, prevPhoto.element);
        prevPhoto.placeholder = placeholder;

        ensurePhotoInViewport(prevPhoto.element);

        modalImageContainer.innerHTML = "";
        modalImageContainer.appendChild(prevPhoto.element);
        
        // Nova tranzicija koja prati swipe pokret
        gsap.set(prevPhoto.element, {
            opacity: 1,
            x: '-100%',
            scale: 0.95,
            rotation: -3
        });

        gsap.to(prevPhoto.element, {
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out"
        });

        modalTitle.textContent = prevPhoto.title;
        modalExif.textContent = prevPhoto.exif;
        activePhoto = prevPhoto.element;
        currentPhotoIndex = newIndex;
    }

    document.addEventListener("keydown", (e) => {
        if (modal.classList.contains("active")) {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") showNextPhoto();
            if (e.key === "ArrowLeft") showPreviousPhoto();
        }
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    closeButton.addEventListener("click", closeModal);
    prevButton.addEventListener("click", showPreviousPhoto);
    nextButton.addEventListener("click", showNextPhoto);

    // Inicijalizacija Hammer.js za touch interakcije
    const hammer = new Hammer(modalImageContainer);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    
    let isDragging = false;
    let startX = 0;
    
    hammer.on('panstart', function(e) {
        isDragging = true;
        startX = e.center.x;
        
        // Zaustavimo trenutnu GSAP animaciju ako postoji
        gsap.killTweensOf(activePhoto);
    });
    
    hammer.on('pan', function(e) {
        if (!isDragging || !activePhoto) return;
        
        const moveX = e.center.x - startX;
        const movePercent = (moveX / window.innerWidth) * 100;
        
        // Dodajemo malo otpora kad se vuče
        const resistance = 0.5;
        const limitedMovePercent = Math.min(Math.max(movePercent * resistance, -50), 50);
        
        // Računamo scale i opacity bazirano na pomaku
        const moveAbs = Math.abs(limitedMovePercent);
        const scale = gsap.utils.mapRange(0, 50, 1, 0.3)(moveAbs);
        const opacity = gsap.utils.mapRange(0, 50, 1, 0)(moveAbs);
        
        gsap.set(activePhoto, {
            x: limitedMovePercent + '%',
            rotation: limitedMovePercent * 0.05,
            scale: scale,
            opacity: opacity
        });
    });
    
    hammer.on('panend', function(e) {
        if (!isDragging || !activePhoto) return;
        isDragging = false;
        
        const velocity = Math.abs(e.velocity);
        const moveX = e.deltaX;
        const threshold = window.innerWidth * 0.2;
        
        if (Math.abs(moveX) > threshold || velocity > 0.5) {
            if (moveX < 0) {
                showNextPhoto();
            } else {
                showPreviousPhoto();
            }
        } else {
            // Vrati na početnu poziciju s animacijom
            gsap.to(activePhoto, {
                x: '0%',
                rotation: 0,
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
}

// Inicijalizacija modala
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPhotoModal);
} else {
  initPhotoModal();
}
