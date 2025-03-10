// Globalne skripte
import initLenis from './global/lenis-config.js';
import initDarkMode from './global/dark-mode.js';
import initFooter from './global/footer-gsap.js';
import initLinksHover from './global/links-hover-effect.js';
import initIosSafariFix from './global/ios-safari-fix.js';

// Home page skripte
import initHero from './home/hero.js';
import initAboutSection from './home/about-section.js';
import initHighlights from './home/highlights.js';
import initCategories from './home/categories.js';

// Work page skripte
import initGrid from './work/grid.js';
import initPhotoModal from './work/photo-modal.js';

// About page
import initAbout from './about/about.js';

import initBarba from './global/barba-config.js';

// Globalno dostupne funkcije
window.initLenis = initLenis;
window.initLinksHover = initLinksHover;
window.initFooter = initFooter;
window.initDarkMode = initDarkMode;
window.initIosSafariFix = initIosSafariFix;


window.initAboutSection = initAboutSection;
window.initHero = initHero;
window.initHighlights = initHighlights;
window.initCategories = initCategories;
window.initGrid = initGrid;
window.initPhotoModal = initPhotoModal;
window.initAbout = initAbout;

window.initBarba = initBarba;