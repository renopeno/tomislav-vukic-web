import Lenis from '@studio-freight/lenis';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Registriraj ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function initLenis () {
    const lenis = new Lenis({
        duration: 0.65, // Tromost scrolla
        easing: (t) => 1 - Math.pow(1 - t, 3), // Blago ubrzanje i usporavanje
        smooth: true, // Omogući smooth scroll
        smoothTouch: true, // Poboljšano scrollanje za touch uređaje
    });

    // Pokretanje animacije s requestAnimationFrame
    function raf(time) {
        lenis.raf(time); // Pozovi Lenis na svaku promjenu frejmova
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Povezivanje GSAP-a i Lenis-a
    gsap.ticker.add((time) => lenis.raf(time));

    // Ažuriranje ScrollTrigger-a za Lenis
    lenis.on('scroll', ScrollTrigger.update);
}

export default initLenis;