function initPhotoModal() {
    // DOM elementi
    const modal = document.querySelector(".modal-photo");
    const modalImageContainer = modal.querySelector(".modal-photo-container");
    const modalTitle = modal.querySelector(".modal-title");
    const modalExif = modal.querySelector(".modal-exif");
    const closeButton = modal.querySelector(".modal-close");
    const gridPhotos = document.querySelectorAll(".photo");

    // State management
    let currentPhotoIndex = 0;
    let photoData = [];
    let activePhoto = null;

    // Dodaj Swiper klase na container
    modalImageContainer.classList.add('swiper');
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    modalImageContainer.appendChild(swiperWrapper);

    function updatePhotoInfo(photo) {
        if (photo) {
            modalTitle.textContent = photo.title;
            modalExif.textContent = photo.exif;
        }
    }

    // Inicijalizacija Swipera
    const swiper = new Swiper(modalImageContainer, {
        slidesPerView: 1,
        centeredSlides: true,
        speed: 400,
        grabCursor: true,
        effect: 'slide',
        loop: true,
        on: {
            slideChange: function () {
                if (photoData.length) {
                    const realIndex = this.realIndex;
                    currentPhotoIndex = realIndex;
                    updatePhotoInfo(photoData[realIndex]);
                }
            }
        }
    });

    function openModal(photo) {
        if (window.lenis) window.lenis.stop();
        document.body.style.overflow = 'hidden';

        // Očisti postojeće slideove
        swiperWrapper.innerHTML = '';

        // Dodaj sve fotke kao slideove
        photoData.forEach((photo, index) => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.appendChild(photo.element);
            swiperWrapper.appendChild(slide);
        });

        // Postavi trenutnu fotku
        swiper.update();
        swiper.slideTo(currentPhotoIndex, 0, false);
        updatePhotoInfo(photo);

        modal.style.display = "grid";
        modal.classList.add("active");
    }

    function closeModal() {
        if (window.lenis) window.lenis.start();
        document.body.style.overflow = '';
        
        // Vrati sve fotke nazad u grid
        photoData.forEach(photo => {
            if (photo.placeholder && photo.element.originalParent) {
                photo.element.originalParent.insertBefore(photo.element, photo.placeholder);
                photo.placeholder.remove();
                photo.placeholder = null;
            }
        });

        modal.classList.remove("active");
        modal.style.display = "none";
        activePhoto = null;
    }

    // Event listeneri
    document.addEventListener("keydown", (e) => {
        if (modal.classList.contains("active")) {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") swiper.slideNext();
            if (e.key === "ArrowLeft") swiper.slidePrev();
        }
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    closeButton.addEventListener("click", closeModal);

    // Inicijalizacija i postavljanje podataka za svaku fotku
    gridPhotos.forEach((photo, index) => {
        const container = window.shuffledPhotos.find(container => container.querySelector('.photo') === photo);
        const actualIndex = window.shuffledPhotos.indexOf(container);

        photo.originalParent = photo.parentElement;
        photoData[actualIndex] = {
            src: photo.getAttribute("src"),
            title: photo.getAttribute("data-title"),
            exif: photo.getAttribute("data-exif"),
            category: photo.getAttribute("data-category"),
            element: photo,
            placeholder: null
        };

        photo.addEventListener("click", () => {
            currentPhotoIndex = actualIndex;
            activePhoto = photo;
            openModal(photoData[currentPhotoIndex]);
        });
    });
}

// initPhotoModal(); // Ovo mi ne treba trenutno jer ga inicijaliziram u grid.js
