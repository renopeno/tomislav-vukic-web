// Importaj sve potrebne module
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";
import CustomEase from "gsap/CustomEase";

import './dark-mode.js';
import './footer-gsap.js';
import './links-hover-effect.js';
import initLenis from './lenis-config.js'; // Ažurirano ime

// Registracija GSAP pluginova
function initGsapPlugins() {
    gsap.registerPlugin(Flip, ScrollTrigger, CustomEase);
}
initGsapPlugins();

// POZIV FUNKCIJE ZA INICIJALIZACIJU LENIS
initLenis(); // <--- Ovdje se sad inicijalizira

// Dinamičko učitavanje Barba.js
function loadBarbaConfig() {
    import('./barba-config.js')
        .then(() => {
            console.log('Barba.js konfiguracija učitana.');
        })
        .catch((error) => {
            console.error('Greška pri učitavanju Barba konfiguracije:', error);
        });
}

// Pokreni sve na load
window.addEventListener('load', () => {
    loadBarbaConfig();
});