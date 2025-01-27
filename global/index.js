import './barba.js';
import './dark-mode.js';
import './footer-gsap.js';
import './gsap-plugins.js';
import './lenis.js';
import './links-hover-effect.js';

function loadBarba() {
    if (document.querySelector('script[src="https://tomislav-vukic-web-team-renopeno.vercel.app/barba.bundle.js"]')) {
        console.log('Barba.js već učitan');
        return;
    }
    const script = document.createElement('script');
    script.src = "https://tomislav-vukic-web-team-renopeno.vercel.app/barba.bundle.js"; // URL Barba.js bundle-a
    script.defer = true;
    document.body.appendChild(script);
  
    script.onload = () => {
      console.log('Barba.js loaded successfully!');
    };
  
    script.onerror = () => {
      console.error('Failed to load Barba.js');
    };
}
  
  // Pozovi loadBarba nakon što se sve ostale funkcije inicijaliziraju
  window.addEventListener('load', () => {
    loadBarba(); // Dinamički učitaj Barba.js
  });