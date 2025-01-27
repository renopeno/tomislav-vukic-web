function initFooter() {
    const footer = document.querySelector('.section.footer');
    const previousSection = footer.previousElementSibling; // Automatski dohvaća sekciju iznad footera

    if (previousSection) {
    // "Fake scroll" za prethodnu sekciju (osigurava da je pin ne dira)
    gsap.to(previousSection, {
        scrollTrigger: {
        trigger: previousSection, // Prethodna sekcija
        start: 'top top', // Početak sticky ponašanja
        end: () => `+=${window.innerHeight * 0.5}`, // Dodaj dodatni prostor
        pin: false, // Važno: Isključujemo pin kako ne bi poremetilo strukturu
        scrub: true, // Sinkroniziraj s korisničkim scrollom
        },
    });

    // Animacija za footer
    gsap.to(footer, {
        scrollTrigger: {
        trigger: previousSection, // Footer prati kraj prethodne sekcije
        start: () => `bottom+=${window.innerHeight * 0.5} bottom`, // Početak preklapanja
        end: 'bottom bottom', // Kraj footera dolazi na kraj viewporta
        scrub: true, // Sinkroniziraj s korisničkim scrollom
        },
    });
    }

    // Riješi problem s .section.categories preklapanjem
    document.querySelectorAll('.section.categories').forEach((section) => {
    gsap.set(section, {
        zIndex: 1, // Održava visoki z-index kako ne bi nestajalo iza drugih sekcija
    });
    });
}