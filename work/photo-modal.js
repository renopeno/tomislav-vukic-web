function initPhotoModal() {
    const modal = document.querySelector(".modal-photo");
    const modalImageContainer = modal.querySelector(".modal-photo-container");
    const modalTitle = modal.querySelector(".modal-title");
    const modalExif = modal.querySelector(".modal-exif");
    const closeButton = modal.querySelector(".modal-close");
    const prevButton = modal.querySelector('[data-photo-nav="previous"]');
    const nextButton = document.querySelector('[data-photo-nav="next"]');

    gsap.registerPlugin(Flip);

    let currentPhotoIndex = 0;
    let photoData = [];
    let activePhoto = null;

    function ensurePhotoInViewport(photo) {
        const buffer = 100;
        const photoRect = photo.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetScroll = photoRect.top + scrollTop - buffer;
        window.scrollTo(0, targetScroll);
    }

    function openModal(photo) {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        document.body.style.overflow = 'hidden';

        gsap.set(photo.element, { opacity: 0 });

        const gridContent = document.querySelectorAll('.photo, .navigation, .navbar');
        gsap.to(gridContent, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
        });

        const state = Flip.getState(photo.element);
        modalImageContainer.innerHTML = '';
        
        const modalImage = photo.element.cloneNode(true);
        modalImageContainer.appendChild(modalImage);
        
        gsap.set(modalImage, { opacity: 1 });

        modal.style.display = "grid";
        modal.classList.add("active");

        modalTitle.textContent = photo.title;
        modalExif.textContent = photo.exif;

        gsap.set([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20
        });

        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            absolute: true,
            targets: [modalImage],
            onComplete: () => {
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
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);

        document.body.style.overflow = '';

        if (activePhoto) {
            const modalImage = modalImageContainer.querySelector('img');
            const gridContent = document.querySelectorAll('.photo, .navigation, .navbar');

            gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: "power2.in"
            });

            const modalRect = modalImage.getBoundingClientRect();
            gsap.set(modalImage, {
                position: 'fixed',
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
                    modalImageContainer.innerHTML = '';
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
        swapPhoto(nextPhoto);
    }

    function showPreviousPhoto() {
        if (currentPhotoIndex > 0) {
            currentPhotoIndex--;
        } else {
            currentPhotoIndex = photoData.length - 1;
        }
        const prevPhoto = photoData[currentPhotoIndex];
        swapPhoto(prevPhoto);
    }

    function swapPhoto(photo) {
        ensurePhotoInViewport(photo.element);
        gsap.set(photo.element, { opacity: 0 });

        modalImageContainer.innerHTML = '';
        const modalImage = photo.element.cloneNode(true);
        modalImageContainer.appendChild(modalImage);

        gsap.set(modalImage, { opacity: 1 });

        modalTitle.textContent = photo.title;
        modalExif.textContent = photo.exif;
        activePhoto = photo.element;
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!window.shuffledPhotos) {
            console.error("⚠️ shuffledPhotos nije pronađen!");
            return;
        }

        photoData = window.shuffledPhotos.map(container => {
            const photo = container.querySelector(".photo");
            return {
                src: photo.getAttribute("src"),
                title: photo.getAttribute("data-title"),
                exif: photo.getAttribute("data-exif"),
                category: photo.getAttribute("data-category"),
                element: photo
            };
        });

        photoData.forEach((photo, index) => {
            photo.element.addEventListener("click", () => {
                currentPhotoIndex = index;
                activePhoto = photo.element;
                openModal(photo);
            });
        });
    });

    prevButton.addEventListener("click", showPreviousPhoto);
    nextButton.addEventListener("click", showNextPhoto);

    document.addEventListener("keydown", (e) => {
        if (modal.classList.contains("active")) {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") showNextPhoto();
            if (e.key === "ArrowLeft") showPreviousPhoto();
        }
    });

    closeButton.addEventListener("click", closeModal);
}

initPhotoModal();