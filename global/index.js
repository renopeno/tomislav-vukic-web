import './dark-mode.js';
import './footer-gsap.js';
import './links-hover-effect.js';
import initLenis from './lenis-config.js';
import { initGsapPlugins } from './gsap-plugins.js';

initLenis();
initGsapPlugins();

function loadBarbaConfig() {
  import('./barba-config.js')
    .then(() => console.log('Barba.js konfiguracija učitana.'))
    .catch((error) => console.error('Greška pri učitavanju Barba konfiguracije:', error));
}

export default loadBarbaConfig;