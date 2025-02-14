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
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetScroll = photoRect.top + scrollTop - buffer;
        window.scrollTo(0, targetScroll);
    }

    gridPhotos.forEach((photo, index) => {
        photoData.push({
            src: photo.getAttribute("src"),
            title: photo.getAttribute("data-title"),
            exif: photo.getAttribute("data-exif"),
            category: photo.getAttribute("data-category"),
            element: photo
        });

        photo.addEventListener("click", () => {
            currentPhotoIndex = index;
            activePhoto = photo;
            openModal(photoData[currentPhotoIndex]);
        });
    });

    function openModal(photo) {
        // Instantno sakrijemo kliknutu fotku
        gsap.set(photo.element, { opacity: 0 });
        
        // Sakrijemo SVE s grida (sve fotke i navigaciju) i navbar
        const gridContent = document.querySelectorAll('.photo, .navigation, .navbar');
        gsap.to(gridContent, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
        });
        
        // Spremimo stanje prije animacije
        const state = Flip.getState(photo.element);
        
        // Očistimo prethodni sadržaj
        modalImageContainer.innerHTML = '';
        
        // Napravimo klon i dodamo ga u modal
        const modalImage = photo.element.cloneNode(true);
        modalImageContainer.appendChild(modalImage);
        
        // Osiguramo da je modalna fotka vidljiva
        gsap.set(modalImage, { opacity: 1 });
        
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
            targets: [modalImage],
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
            const modalImage = modalImageContainer.querySelector('img');
            const gridContent = document.querySelectorAll('.photo, .navigation, .navbar');
            
            // Prvo sakrijemo UI elemente modala
            gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: "power2.in"
            });

            // Spremimo trenutnu poziciju i dimenzije modalne slike
            const modalRect = modalImage.getBoundingClientRect();
            
            // Fiksiramo modalnu sliku na trenutnoj poziciji
            gsap.set(modalImage, {
                position: 'fixed',
                top: modalRect.top,
                left: modalRect.left,
                width: modalRect.width,
                height: modalRect.height,
                zIndex: 1000
            });

            // Animiramo prema poziciji grid slike
            const targetBounds = activePhoto.getBoundingClientRect();
            gsap.to(modalImage, {
                top: targetBounds.top,
                left: targetBounds.left,
                width: targetBounds.width,
                height: targetBounds.height,
                duration: 0.8,
                ease: "power2.inOut",
                onUpdate: function() {
                    // Kad smo na 70% animacije, počnemo pokazivati grid content
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
                    modalImageContainer.innerHTML = '';
                    // Instantno pokažemo originalnu fotku
                    gsap.set(activePhoto, { opacity: 1 });
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

initPhotoModal();