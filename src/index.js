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
import './home/highlights.js';
import './home/categories.js';

// Work page skripte
import { initWork, initCategoryTitleAnimation } from './work/work.js';
import { initPhotoModal } from './work/photo-modal.js';

// Sprječava Vite da tree-shake-a ove funkcije jer se koriste dinamički
// Postavi ih na window i aktivno ih referenciraj da Vite vidi da se koriste
window.initWork = initWork;
window.initCategoryTitleAnimation = initCategoryTitleAnimation;
window.initPhotoModal = initPhotoModal;

// Dummy poziv koji osigurava da Vite zadrži funkcije u buildu
// (nikad se neće izvršiti, ali Vite vidi da se funkcije "koriste")
if (false) {
  initWork();
  initCategoryTitleAnimation();
  initPhotoModal();
}

// About page
import './about/about-page.js';