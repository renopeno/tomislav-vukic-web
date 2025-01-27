/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./about/index.js":
/*!************************!*\
  !*** ./about/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _global_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/index.js */ \"./global/index.js\");\n // Uključujemo globalne funkcije\n// Dodaj sve fileove unutar foldera\n// import './filename.js';\n\n//# sourceURL=webpack://tomislavvukic.com/./about/index.js?");

/***/ }),

/***/ "./global/barba.js":
/*!*************************!*\
  !*** ./global/barba.js ***!
  \*************************/
/***/ (() => {

eval("function updateNavigationWithHref() {\n  var navLinks = document.querySelectorAll('.nav-link');\n  var currentHref = window.location.pathname; // Trenutni URL put\n\n  navLinks.forEach(function (link) {\n    var linkHref = link.getAttribute('href');\n    if (currentHref === linkHref || currentHref === '/' && linkHref === '/') {\n      // Ako se `currentHref` poklapa s `linkHref`, postavi kao current\n      link.setAttribute('aria-current', 'page');\n      link.classList.add('current');\n      link.classList.add('w--current'); // Webflow klasa\n    } else {\n      // Ukloni current s drugih linkova\n      link.removeAttribute('aria-current');\n      link.classList.remove('current');\n      link.classList.remove('w--current');\n    }\n  });\n  console.log(\"Navigacija a\\u017Eurirana za href: \".concat(currentHref));\n}\n\n// Razdijeljivanje funkcija na globalne i page-specific, kako bi ih dolje lakše organizirao u viewsima\nfunction initGlobalFunctions() {\n  if (typeof initFooter === 'function') initFooter();\n  if (typeof initLinksHover === 'function') initLinksHover();\n  if (typeof initDarkMode === 'function') initDarkMode();\n  if (typeof initLenis === 'function') initLenis();\n  if (typeof initGsapPlugins === 'function') initGsapPlugins();\n}\nfunction initPageSpecificFunctions(namespace) {\n  switch (namespace) {\n    case 'home':\n      if (typeof initHomeHero === 'function') initHomeHero();\n      if (typeof initHomeHighlights === 'function') initHomeHighlights();\n      if (typeof initHomeCategories === 'function') initHomeCategories();\n      break;\n    case 'work':\n      if (typeof initPhotoGrid === 'function') initPhotoGrid();\n      break;\n    case 'about':\n      // Dodaj init funkcije specifične za About page\n      break;\n    default:\n      console.log(\"No specific init functions for namespace: \".concat(namespace));\n      break;\n  }\n}\n\n// Barba.js konfiguracija\nbarba.init({\n  transitions: [{\n    name: 'fade',\n    leave: function leave(data) {\n      return gsap.to(data.current.container, {\n        opacity: 0,\n        duration: 0.5\n      });\n    },\n    enter: function enter(data) {\n      window.scrollTo(0, 0); // Resetiraj skrol na vrh\n      return gsap.from(data.next.container, {\n        opacity: 0,\n        duration: 0.5\n      });\n    }\n  }],\n  views: [{\n    namespace: 'home',\n    afterEnter: function afterEnter(data) {\n      initGlobalFunctions();\n      initPageSpecificFunctions('home');\n      updateNavigationWithHref('home'); // Ažuriranje navigacije\n    }\n  }, {\n    namespace: 'work',\n    afterEnter: function afterEnter(data) {\n      initGlobalFunctions();\n      initPageSpecificFunctions('work');\n      updateNavigationWithHref('work'); // Ažuriranje navigacije\n    }\n  }]\n});\n\n//# sourceURL=webpack://tomislavvukic.com/./global/barba.js?");

/***/ }),

/***/ "./global/dark-mode.js":
/*!*****************************!*\
  !*** ./global/dark-mode.js ***!
  \*****************************/
/***/ (() => {

eval("function initDarkMode() {\n  document.addEventListener(\"DOMContentLoaded\", function () {\n    var themeSwitcher = document.querySelector('.nav-theme-switcher');\n    var body = document.body;\n\n    // Provjeri je li već spremljeno stanje u localStorage\n    if (localStorage.getItem('dark-mode') === 'enabled') {\n      body.classList.add('ui-dark-mode'); // Postavi dark mode\n    }\n\n    // Dodaj event listener za klik na theme switcher\n    themeSwitcher.addEventListener('click', function () {\n      // Provjeri ima li body već klasu `.ui-dark-mode`\n      if (body.classList.contains('ui-dark-mode')) {\n        body.classList.remove('ui-dark-mode'); // Makni klasu za dark mode\n        localStorage.setItem('dark-mode', 'disabled'); // Spremi stanje u localStorage\n      } else {\n        body.classList.add('ui-dark-mode'); // Dodaj klasu za dark mode\n        localStorage.setItem('dark-mode', 'enabled'); // Spremi stanje u localStorage\n      }\n    });\n  });\n}\n\n//# sourceURL=webpack://tomislavvukic.com/./global/dark-mode.js?");

/***/ }),

/***/ "./global/footer-gsap.js":
/*!*******************************!*\
  !*** ./global/footer-gsap.js ***!
  \*******************************/
/***/ (() => {

eval("function initFooter() {\n  var footer = document.querySelector('.section.footer');\n  var previousSection = footer.previousElementSibling; // Automatski dohvaća sekciju iznad footera\n\n  if (previousSection) {\n    // \"Fake scroll\" za prethodnu sekciju (osigurava da je pin ne dira)\n    gsap.to(previousSection, {\n      scrollTrigger: {\n        trigger: previousSection,\n        // Prethodna sekcija\n        start: 'top top',\n        // Početak sticky ponašanja\n        end: function end() {\n          return \"+=\".concat(window.innerHeight * 0.5);\n        },\n        // Dodaj dodatni prostor\n        pin: false,\n        // Važno: Isključujemo pin kako ne bi poremetilo strukturu\n        scrub: true // Sinkroniziraj s korisničkim scrollom\n      }\n    });\n\n    // Animacija za footer\n    gsap.to(footer, {\n      scrollTrigger: {\n        trigger: previousSection,\n        // Footer prati kraj prethodne sekcije\n        start: function start() {\n          return \"bottom+=\".concat(window.innerHeight * 0.5, \" bottom\");\n        },\n        // Početak preklapanja\n        end: 'bottom bottom',\n        // Kraj footera dolazi na kraj viewporta\n        scrub: true // Sinkroniziraj s korisničkim scrollom\n      }\n    });\n  }\n\n  // Riješi problem s .section.categories preklapanjem\n  document.querySelectorAll('.section.categories').forEach(function (section) {\n    gsap.set(section, {\n      zIndex: 1 // Održava visoki z-index kako ne bi nestajalo iza drugih sekcija\n    });\n  });\n}\n\n//# sourceURL=webpack://tomislavvukic.com/./global/footer-gsap.js?");

/***/ }),

/***/ "./global/gsap-plugins.js":
/*!********************************!*\
  !*** ./global/gsap-plugins.js ***!
  \********************************/
/***/ (() => {

eval("function initGsapPlugins() {\n  gsap.registerPlugin(Flip, ScrollTrigger, CustomEase);\n}\n\n//# sourceURL=webpack://tomislavvukic.com/./global/gsap-plugins.js?");

/***/ }),

/***/ "./global/index.js":
/*!*************************!*\
  !*** ./global/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _barba_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./barba.js */ \"./global/barba.js\");\n/* harmony import */ var _barba_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_barba_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _dark_mode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dark-mode.js */ \"./global/dark-mode.js\");\n/* harmony import */ var _dark_mode_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_dark_mode_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _footer_gsap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./footer-gsap.js */ \"./global/footer-gsap.js\");\n/* harmony import */ var _footer_gsap_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_footer_gsap_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _gsap_plugins_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gsap-plugins.js */ \"./global/gsap-plugins.js\");\n/* harmony import */ var _gsap_plugins_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_gsap_plugins_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _lenis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lenis.js */ \"./global/lenis.js\");\n/* harmony import */ var _lenis_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_lenis_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _links_hover_effect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./links-hover-effect.js */ \"./global/links-hover-effect.js\");\n/* harmony import */ var _links_hover_effect_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_links_hover_effect_js__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nfunction loadBarba() {\n  if (document.querySelector('script[src=\"https://tomislav-vukic-web-team-renopeno.vercel.app/barba.bundle.js\"]')) {\n    console.log('Barba.js već učitan');\n    return;\n  }\n  var script = document.createElement('script');\n  script.src = \"https://tomislav-vukic-web-team-renopeno.vercel.app/barba.bundle.js\"; // URL Barba.js bundle-a\n  script.defer = true;\n  document.body.appendChild(script);\n  script.onload = function () {\n    console.log('Barba.js loaded successfully!');\n  };\n  script.onerror = function () {\n    console.error('Failed to load Barba.js');\n  };\n}\n\n// Pozovi loadBarba nakon što se sve ostale funkcije inicijaliziraju\nwindow.addEventListener('load', function () {\n  loadBarba(); // Dinamički učitaj Barba.js\n});\n\n//# sourceURL=webpack://tomislavvukic.com/./global/index.js?");

/***/ }),

/***/ "./global/lenis.js":
/*!*************************!*\
  !*** ./global/lenis.js ***!
  \*************************/
/***/ (() => {

eval("function initLenis() {\n  var lenis = new Lenis({\n    duration: 0.65,\n    // Tromost scrolla\n    easing: function easing(t) {\n      return 1 - Math.pow(1 - t, 3);\n    },\n    // Blago ubrzanje i usporavanje\n    smooth: true,\n    // Omogući smooth scroll\n    smoothTouch: true // Poboljšano scrollanje za touch uređaje\n  });\n\n  // Pokretanje animacije s requestAnimationFrame\n  function raf(time) {\n    lenis.raf(time); // Pozovi Lenis na svaku promjenu frejmova\n    requestAnimationFrame(raf);\n  }\n  requestAnimationFrame(raf);\n\n  // Povezivanje GSAP-a i Lenis-a\n  gsap.ticker.add(function (time) {\n    return lenis.raf(time);\n  });\n\n  // Ažuriranje ScrollTrigger-a za Lenis\n  lenis.on('scroll', ScrollTrigger.update);\n}\n\n//# sourceURL=webpack://tomislavvukic.com/./global/lenis.js?");

/***/ }),

/***/ "./global/links-hover-effect.js":
/*!**************************************!*\
  !*** ./global/links-hover-effect.js ***!
  \**************************************/
/***/ (() => {

eval("function initLinksHover() {\n  document.querySelectorAll('.link').forEach(function (link) {\n    var originalText = link.textContent;\n\n    // Funkcija za generiranje random permutacije slova iz riječi\n    var shuffleWord = function shuffleWord(word) {\n      var letters = word.split('');\n      for (var i = letters.length - 1; i > 0; i--) {\n        var j = Math.floor(Math.random() * (i + 1));\n        var _ref = [letters[j], letters[i]];\n        letters[i] = _ref[0];\n        letters[j] = _ref[1];\n      }\n      return letters.join('');\n    };\n\n    // Hover efekt\n    link.addEventListener('mouseenter', function () {\n      var currentText = originalText;\n      var counter = 0;\n\n      // Postavi interval za shuffle\n      var shuffleInterval = setInterval(function () {\n        if (counter < 3) {\n          // Generiraj random riječ\n          currentText = shuffleWord(originalText);\n          link.textContent = currentText;\n          counter++;\n        } else {\n          // Vrati originalnu riječ nakon 3 shufflea\n          link.textContent = originalText;\n          clearInterval(shuffleInterval);\n        }\n      }, 100); // 100ms između svake promjene\n    });\n  });\n}\n\n//# sourceURL=webpack://tomislavvukic.com/./global/links-hover-effect.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./about/index.js");
/******/ 	
/******/ })()
;