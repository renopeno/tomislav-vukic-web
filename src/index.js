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

// Work page skripte (side-effect imports kao Hero i About)
import './work/work.js';
import './work/photo-modal.js';

// About page
import './about/about-page.js';