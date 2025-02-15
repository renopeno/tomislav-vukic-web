function initPhotoModal() {
    const modal = document.querySelector(".modal-photo");
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

    // Tiho scrollanje do fotke u pozadini (dok je modal aktivan)
    function ensurePhotoInViewport(photo) {
        const buffer = 100;
        const photoRect = photo.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetScroll = photoRect.top + scrollTop - buffer;
        window.scrollTo(0, targetScroll);
    }

    gridPhotos.forEach((photo, index) => {
        // Pronađi odgovarajući container iz shuffledPhotos array-a
        const container = window.shuffledPhotos.find(container => 
            container.querySelector('.photo') === photo
        );
        
        // Pronađi stvarni index u shuffledPhotos array-u
        const actualIndex = window.shuffledPhotos.indexOf(container);
        
        photoData[actualIndex] = {
            src: photo.getAttribute("src"),
            title: photo.getAttribute("data-title"),
            exif: photo.getAttribute("data-exif"),
            category: photo.getAttribute("data-category"),
            element: photo
        };

        photo.addEventListener("click", () => {
            currentPhotoIndex = actualIndex;
            activePhoto = photo;
            openModal(photoData[currentPhotoIndex]);
        });
    });

    function openModal(photo) {
        // Zaustavi Lenis scroll
        if (window.lenis) {
            window.lenis.stop();
        }
        
        // Spriječi scroll na body
        document.body.style.overflow = 'hidden';
        
        // Spremi stanje prije animacije
        const state = Flip.getState(photo.element);
        
        // Sakrijemo SVE s grida (sve fotke i navigaciju) i navbar
        const gridContent = document.querySelectorAll('.photo, .navigation, .navbar');
        gsap.to(gridContent, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
        });
        
        // Premjesti originalnu fotku u modal
        modalImageContainer.appendChild(photo.element);
        
        // Pripremimo modal
        modal.style.display = "grid";
        modal.classList.add("active");
        
        // Postavimo podatke
        modalTitle.textContent = photo.title;
        modalExif.textContent = photo.exif;
        
        // Sakrijemo UI elemente modala inicijalno
        gsap.set([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20
        });

        // FLIP animacija
        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            absolute: true,
            onComplete: () => {
                // Animiramo UI elemente modala
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
        if (activePhoto) {
            // Ponovno pokreni Lenis scroll
            if (window.lenis) {
                window.lenis.start();
            }
            
            // Vrati scroll na body
            document.body.style.overflow = '';
            
            const modalImage = modalImageContainer.querySelector('img');
            const gridContent = document.querySelectorAll('.photo, .navigation, .navbar');
            
            // Prvo sakrijemo UI elemente modala
            gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: "power2.in"
            });

            // Spremi stanje prije vraćanja
            const state = Flip.getState(modalImage);
            
            // Vrati sliku u originalni container
            const originalContainer = photoData[currentPhotoIndex].element.parentElement;
            originalContainer.appendChild(modalImage);

            // FLIP animacija za povratak
            Flip.from(state, {
                duration: 0.8,
                ease: "power2.inOut",
                onUpdate: function() {
                    if (this.progress() > 0.7) {
                        gsap.to(gridContent, {
                            opacity: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                },
                onComplete: () => {
                    modal.classList.remove("active");
                    modal.style.display = "none";
                    activePhoto = null;
                }
            });
        }
    }

    function showNextPhoto() {
        if (currentPhotoIndex < photoData.length - 1) {
            currentPhotoIndex++;
        } else {
            currentPhotoIndex = 0;
        }
        const nextPhoto = photoData[currentPhotoIndex];
        
        // Prvo tiho scrollamo do sljedeće fotke
        ensurePhotoInViewport(nextPhoto.element);
        
        // Sakrijemo originalnu fotku u gridu
        gsap.set(nextPhoto.element, { opacity: 0 });
        
        modalImageContainer.innerHTML = '';
        const modalImage = nextPhoto.element.cloneNode(true);
        modalImageContainer.appendChild(modalImage);
        
        // Osiguramo da je modalna fotka vidljiva
        gsap.set(modalImage, { opacity: 1 });
        
        modalTitle.textContent = nextPhoto.title;
        modalExif.textContent = nextPhoto.exif;
        activePhoto = nextPhoto.element;
    }

    function showPreviousPhoto() {
        if (currentPhotoIndex > 0) {
            currentPhotoIndex--;
        } else {
            currentPhotoIndex = photoData.length - 1;
        }
        const prevPhoto = photoData[currentPhotoIndex];
        
        // Prvo tiho scrollamo do prethodne fotke
        ensurePhotoInViewport(prevPhoto.element);
        
        // Sakrijemo originalnu fotku u gridu
        gsap.set(prevPhoto.element, { opacity: 0 });
        
        modalImageContainer.innerHTML = '';
        const modalImage = prevPhoto.element.cloneNode(true);
        modalImageContainer.appendChild(modalImage);
        
        // Osiguramo da je modalna fotka vidljiva
        gsap.set(modalImage, { opacity: 1 });
        
        modalTitle.textContent = prevPhoto.title;
        modalExif.textContent = prevPhoto.exif;
        activePhoto = prevPhoto.element;
    }

    prevButton.addEventListener("click", showPreviousPhoto);
    nextButton.addEventListener("click", showNextPhoto);

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
}

// initPhotoModal();