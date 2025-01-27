"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktomislavvukic_com"] = self["webpackChunktomislavvukic_com"] || []).push([["global_barba-config_js"],{

/***/ "./global/barba-config.js":
/*!********************************!*\
  !*** ./global/barba-config.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initBarba: () => (/* binding */ initBarba)\n/* harmony export */ });\nfunction updateNavigationWithHref() {\n  var navLinks = document.querySelectorAll('.nav-link');\n  var currentHref = window.location.pathname;\n  navLinks.forEach(function (link) {\n    var linkHref = link.getAttribute('href');\n    if (currentHref === linkHref || currentHref === '/' && linkHref === '/') {\n      link.setAttribute('aria-current', 'page');\n      link.classList.add('current', 'w--current');\n    } else {\n      link.removeAttribute('aria-current');\n      link.classList.remove('current', 'w--current');\n    }\n  });\n  console.log(\"Navigacija a\\u017Eurirana za href: \".concat(currentHref));\n}\nfunction initGlobalFunctions() {\n  if (typeof initFooter === 'function') initFooter();\n  if (typeof initLinksHover === 'function') initLinksHover();\n  if (typeof initDarkMode === 'function') initDarkMode();\n  if (typeof initLenis === 'function') initLenis();\n  if (typeof initGsapPlugins === 'function') initGsapPlugins();\n}\nfunction initPageSpecificFunctions(namespace) {\n  switch (namespace) {\n    case 'home':\n      if (typeof initHomeHero === 'function') initHomeHero();\n      if (typeof initHomeHighlights === 'function') initHomeHighlights();\n      if (typeof initHomeCategories === 'function') initHomeCategories();\n      break;\n    case 'work':\n      if (typeof initPhotoGrid === 'function') initPhotoGrid();\n      break;\n    case 'about':\n      // Dodaj init funkcije specifične za About page\n      break;\n    default:\n      console.log(\"No specific init functions for namespace: \".concat(namespace));\n      break;\n  }\n}\n\n// Barba konfiguracija\nfunction initBarba() {\n  barba.init({\n    transitions: [{\n      name: 'fade',\n      leave: function leave(data) {\n        return gsap.to(data.current.container, {\n          opacity: 0,\n          duration: 0.5\n        });\n      },\n      enter: function enter(data) {\n        window.scrollTo(0, 0); // Resetiraj scroll na vrh\n        return gsap.from(data.next.container, {\n          opacity: 0,\n          duration: 0.5\n        });\n      }\n    }],\n    views: [{\n      namespace: 'home',\n      afterEnter: function afterEnter(data) {\n        initGlobalFunctions();\n        initPageSpecificFunctions('home');\n        updateNavigationWithHref();\n      }\n    }, {\n      namespace: 'work',\n      afterEnter: function afterEnter(data) {\n        initGlobalFunctions();\n        initPageSpecificFunctions('work');\n        updateNavigationWithHref();\n      }\n    }]\n  });\n}\n\n//# sourceURL=webpack://tomislavvukic.com/./global/barba-config.js?");

/***/ })

}]);