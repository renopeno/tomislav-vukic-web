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
        if (window.lenis) {
            window.lenis.stop();
        }
        document.body.style.overflow = 'hidden';

        // Bilježimo FLIP stanje prije nego što napravimo bilo kakve promjene (prije placeholdera)
        const state = Flip.getState(photo.element, { props: "all" });

        // Kreiramo placeholder u originalnom containeru da grid ostane statičan
        const originalParent = photo.element.originalParent;
        const placeholder = document.createElement("div");
        placeholder.classList.add("photo-placeholder");
        placeholder.style.width = photo.element.offsetWidth + "px";
        placeholder.style.height = photo.element.offsetHeight + "px";
        originalParent.insertBefore(placeholder, photo.element);
        photo.placeholder = placeholder;

        /// Izaberemo grid sadržaj, ali izostavljamo aktuelnu fotku (koja se premješta)
        const gridContent = Array.from(document.querySelectorAll('.photo, .navigation, .navbar'))
            .filter(el => el !== photo.element);
                gsap.to(gridContent, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut"
        });

        // Doslovno premještamo originalnu fotku u modal
        modalImageContainer.appendChild(photo.element);
        gsap.set(photo.element, { opacity: 1 });

        // Prikazujemo modal i postavljamo podatke (naslov i exif)
        modal.style.display = "grid";
        modal.classList.add("active");
        modalTitle.textContent = photo.title;
        modalExif.textContent = photo.exif;

        // Sakrivamo UI elemente modala inicijalno
        gsap.set([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20
        });

        // FLIP animacija – fotografija se "prenosi" iz grida u modal
        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            absolute: true,
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
        if (!activePhoto) return;
        if (window.lenis) {
            window.lenis.start();
        }
        document.body.style.overflow = '';

        const photo = photoData[currentPhotoIndex];
        const photoElement = photo.element;
        const gridContent = document.querySelectorAll('.photo, .navigation, .navbar');

        // Sakrivamo UI elemente modala
        gsap.to([modalTitle, modalExif, closeButton, prevButton, nextButton], {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.in"
        });

        // Skrolamo grid do pozicije originalnog containera trenutačne fotke tako da je centriran u viewportu
        const originalParent = photoElement.originalParent;
        const originalRect = originalParent.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetScroll = originalRect.top + scrollTop - (window.innerHeight / 2) + (originalRect.height / 2);
        window.scrollTo({ top: targetScroll, behavior: "auto" });

        // Bilježimo FLIP stanje prije povratka u grid
        const state = Flip.getState(photoElement, { props: "all" });

        // Vraćamo fotku u originalni container na mjesto placeholdera
        if (photo.placeholder && originalParent) {
            originalParent.insertBefore(photoElement, photo.placeholder);
            photo.placeholder.remove();
            photo.placeholder = null;
        }

        // FLIP animacija za povratak u grid; grid sadržaj postupno se vraća
        Flip.from(state, {
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: function () {
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

    function showNextPhoto() {
        // Prekini sve postojeće GSAP animacije na foto elementima
        const allPhotos = document.querySelectorAll('.photo');
        gsap.killTweensOf(allPhotos);

        // Odredi sljedeću fotku ciklički
        let newIndex = (currentPhotoIndex < photoData.length - 1) ? currentPhotoIndex + 1 : 0;
        const currentPhoto = photoData[currentPhotoIndex];
        const nextPhoto = photoData[newIndex];

        // Ako postoji placeholder, reinseriramo trenutačnu fotku u grid
        if (currentPhoto.placeholder && currentPhoto.element.originalParent) {
            currentPhoto.element.originalParent.insertBefore(currentPhoto.element, currentPhoto.placeholder);
            currentPhoto.placeholder.remove();
            currentPhoto.placeholder = null;
        }

        // Osiguravamo da sve fotke osim sljedeće ostanu skrivene
        const gridPhotos = Array.from(document.querySelectorAll('.photo'))
            .filter(el => el !== nextPhoto.element);
        gsap.set(gridPhotos, { opacity: 0 });

        // Kreiraj placeholder za sljedeću fotku u gridu
        const origParent = nextPhoto.element.originalParent;
        const placeholder = document.createElement("div");
        placeholder.classList.add("photo-placeholder");
        placeholder.style.width = nextPhoto.element.offsetWidth + "px";
        placeholder.style.height = nextPhoto.element.offsetHeight + "px";
        origParent.insertBefore(placeholder, nextPhoto.element);
        nextPhoto.placeholder = placeholder;

        // Tiho scrollamo grid tako da je sljedeća fotka centrirana u viewportu
        ensurePhotoInViewport(nextPhoto.element);

        // Premještamo sljedeću fotku u modal i instant postavljamo opacity na 1
        modalImageContainer.innerHTML = "";
        modalImageContainer.appendChild(nextPhoto.element);
        gsap.set(nextPhoto.element, { opacity: 1 });

        // Ažuriramo podatke modala
        modalTitle.textContent = nextPhoto.title;
        modalExif.textContent = nextPhoto.exif;
        activePhoto = nextPhoto.element;
        currentPhotoIndex = newIndex;
    }

    function showPreviousPhoto() {
        // Prekini sve postojeće GSAP animacije na foto elementima
        const allPhotos = document.querySelectorAll('.photo');
        gsap.killTweensOf(allPhotos);

        // Odredi prethodnu fotku ciklički
        let newIndex = (currentPhotoIndex > 0) ? currentPhotoIndex - 1 : photoData.length - 1;
        const currentPhoto = photoData[currentPhotoIndex];
        const prevPhoto = photoData[newIndex];

        if (currentPhoto.placeholder && currentPhoto.element.originalParent) {
            currentPhoto.element.originalParent.insertBefore(currentPhoto.element, currentPhoto.placeholder);
            currentPhoto.placeholder.remove();
            currentPhoto.placeholder = null;
        }

        // Osiguravamo da sve fotke osim prethodne ostanu skrivene
        const gridPhotos = Array.from(document.querySelectorAll('.photo'))
            .filter(el => el !== prevPhoto.element);
        gsap.set(gridPhotos, { opacity: 0 });

        // Kreiraj placeholder za prethodnu fotku u gridu
        const origParent = prevPhoto.element.originalParent;
        const placeholder = document.createElement("div");
        placeholder.classList.add("photo-placeholder");
        placeholder.style.width = prevPhoto.element.offsetWidth + "px";
        placeholder.style.height = prevPhoto.element.offsetHeight + "px";
        origParent.insertBefore(placeholder, prevPhoto.element);
        prevPhoto.placeholder = placeholder;

        // Tiho scrollamo grid tako da je prethodna fotka centrirana u viewportu
        ensurePhotoInViewport(prevPhoto.element);

        // Premještamo prethodnu fotku u modal i instant postavljamo opacity na 1
        modalImageContainer.innerHTML = "";
        modalImageContainer.appendChild(prevPhoto.element);
        gsap.set(prevPhoto.element, { opacity: 1 });

        // Ažuriramo podatke modala
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
}

// initPhotoModal(); // Ovo mi ne treba trenutno jer ga inicijaliziram u grid.js
