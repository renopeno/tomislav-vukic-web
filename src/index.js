// Globalne skripte
import './global/barba-config.js';
import './global/lenis-config.js';
import './global/dark-mode.js';
import './global/footer-gsap.js';
import './global/links-hover.js';
import './global/ios-safari-fix.js';
import './global/scroll-debug.js'; // Debug sustav
import { initCustomCursor } from './global/custom-cursor.js';

// Pokreni custom cursor
initCustomCursor();

// Home page skripte
import './home/hero.js';
import './home/about-section.js';
import './home/about-carousel.js';
import './home/highlights.js';
import './home/categories.js';

// Work page skripte
import './work/work.js';
import { initPhotoModal } from './work/photo-modal.js';

// Forsiramo Vite da zadrži funkciju postavljanjem na window
window.initPhotoModal = initPhotoModal;

// About page
import './about/about-page.js';