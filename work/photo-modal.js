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
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }

    // Priprema podataka za navigaciju unutar modala
    gridPhotos.forEach((photo, index) => {
        const container = window.shuffledPhotos.find(container => 
            container.querySelector('.photo') === photo
        );
        
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
        if (window.lenis) {
            window.lenis.stop();
        }
        document.body.style.overflow = "hidden";

        gsap.set(photo.element, { opacity: 0 });

        const gridContent = document.querySelectorAll('.photo, .navbar');
        gsap.to(gridContent, { opacity: 0, duration: 0.3, ease: "power2.inOut" });

        const state = Flip.getState(photo.element);

        modalImageContainer.appendChild(photo.element);

        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            absolute: true
        });

        modal.style.display = "grid";
        modal.classList.add("active");

        modalTitle.textContent = photo.title;
        modalExif.textContent = photo.exif;

        gsap.set([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20
        });

        gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out"
        });
    }

    function closeModal() {
        if (!activePhoto) return;

        if (window.lenis) {
            window.lenis.start();
        }
        document.body.style.overflow = "";

        const modalImage = modalImageContainer.querySelector("img");
        const gridContent = document.querySelectorAll(".photo, .navbar");

        gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.in"
        });

        const modalRect = modalImage.getBoundingClientRect();

        gsap.set(modalImage, {
            position: "fixed",
            top: modalRect.top,
            left: modalRect.left,
            width: modalRect.width,
            height: modalRect.height,
            zIndex: 1000
        });

        const targetBounds = activePhoto.getBoundingClientRect();
        gsap.to(modalImage, {
            top: targetBounds.top,
            left: targetBounds.left,
            width: targetBounds.width,
            height: targetBounds.height,
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
                modalImageContainer.innerHTML = "";
                activePhoto.parentElement.appendChild(activePhoto);
                gsap.set(activePhoto, { opacity: 1 });
                activePhoto = null;
            }
        });
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoData.length;
        updateModalPhoto();
    }

    function showPreviousPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + photoData.length) % photoData.length;
        updateModalPhoto();
    }

    function updateModalPhoto() {
        const newPhoto = photoData[currentPhotoIndex];

        ensurePhotoInViewport(newPhoto.element);

        gsap.set(newPhoto.element, { opacity: 0 });

        const state = Flip.getState(newPhoto.element);
        modalImageContainer.appendChild(newPhoto.element);

        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            absolute: true
        });

        modalTitle.textContent = newPhoto.title;
        modalExif.textContent = newPhoto.exif;
        activePhoto = newPhoto.element;
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