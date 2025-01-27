/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./global/dark-mode.js":
/*!*****************************!*\
  !*** ./global/dark-mode.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initDarkMode: () => (/* binding */ initDarkMode)\n/* harmony export */ });\nfunction initDarkMode() {\n  document.addEventListener(\"DOMContentLoaded\", function () {\n    var themeSwitcher = document.querySelector('.nav-theme-switcher');\n    var body = document.body;\n    if (localStorage.getItem('dark-mode') === 'enabled') {\n      body.classList.add('ui-dark-mode');\n    }\n    if (themeSwitcher) {\n      themeSwitcher.addEventListener('click', function () {\n        if (body.classList.contains('ui-dark-mode')) {\n          body.classList.remove('ui-dark-mode');\n          localStorage.setItem('dark-mode', 'disabled');\n        } else {\n          body.classList.add('ui-dark-mode');\n          localStorage.setItem('dark-mode', 'enabled');\n        }\n      });\n    }\n  });\n}\n\n\n//# sourceURL=webpack://tomislavvukic.com/./global/dark-mode.js?");

/***/ }),

/***/ "./global/footer-gsap.js":
/*!*******************************!*\
  !*** ./global/footer-gsap.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initFooter: () => (/* binding */ initFooter)\n/* harmony export */ });\nfunction initFooter() {\n  var footer = document.querySelector('.section.footer');\n  var previousSection = footer === null || footer === void 0 ? void 0 : footer.previousElementSibling;\n  if (previousSection) {\n    gsap.to(previousSection, {\n      scrollTrigger: {\n        trigger: previousSection,\n        start: 'top top',\n        end: function end() {\n          return \"+=\".concat(window.innerHeight * 0.5);\n        },\n        pin: false,\n        scrub: true\n      }\n    });\n    gsap.to(footer, {\n      scrollTrigger: {\n        trigger: previousSection,\n        start: function start() {\n          return \"bottom+=\".concat(window.innerHeight * 0.5, \" bottom\");\n        },\n        end: 'bottom bottom',\n        scrub: true\n      }\n    });\n  }\n  document.querySelectorAll('.section.categories').forEach(function (section) {\n    gsap.set(section, {\n      zIndex: 1\n    });\n  });\n}\n\n\n//# sourceURL=webpack://tomislavvukic.com/./global/footer-gsap.js?");

/***/ }),

/***/ "./global/gsap-plugins.js":
/*!********************************!*\
  !*** ./global/gsap-plugins.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initGsapPlugins: () => (/* binding */ initGsapPlugins)\n/* harmony export */ });\nfunction initGsapPlugins() {\n  gsap.registerPlugin(Flip, ScrollTrigger, CustomEase); // Globalni `gsap` dostupan putem CDN-a\n}\n\n\n//# sourceURL=webpack://tomislavvukic.com/./global/gsap-plugins.js?");

/***/ }),

/***/ "./global/index.js":
/*!*************************!*\
  !*** ./global/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _dark_mode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dark-mode.js */ \"./global/dark-mode.js\");\n/* harmony import */ var _footer_gsap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./footer-gsap.js */ \"./global/footer-gsap.js\");\n/* harmony import */ var _links_hover_effect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./links-hover-effect.js */ \"./global/links-hover-effect.js\");\n/* harmony import */ var _lenis_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lenis-config.js */ \"./global/lenis-config.js\");\n/* harmony import */ var _gsap_plugins_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gsap-plugins.js */ \"./global/gsap-plugins.js\");\n\n\n\n\n\n(0,_lenis_config_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n(0,_gsap_plugins_js__WEBPACK_IMPORTED_MODULE_4__.initGsapPlugins)();\nfunction loadBarbaConfig() {\n  Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_barba_core_dist_barba_umd_js\"), __webpack_require__.e(\"global_barba-config_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! ./barba-config.js */ \"./global/barba-config.js\")).then(function () {\n    return console.log('Barba.js konfiguracija učitana.');\n  })[\"catch\"](function (error) {\n    return console.error('Greška pri učitavanju Barba konfiguracije:', error);\n  });\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loadBarbaConfig);\n\n//# sourceURL=webpack://tomislavvukic.com/./global/index.js?");

/***/ }),

/***/ "./global/lenis-config.js":
/*!********************************!*\
  !*** ./global/lenis-config.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _studio_freight_lenis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @studio-freight/lenis */ \"./node_modules/@studio-freight/lenis/dist/lenis.mjs\");\n/* harmony import */ var _gsap_plugins_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gsap-plugins.js */ \"./global/gsap-plugins.js\");\n\n\n(0,_gsap_plugins_js__WEBPACK_IMPORTED_MODULE_0__.initGsapPlugins)();\nfunction initLenis() {\n  var lenis = new _studio_freight_lenis__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n    duration: 0.65,\n    easing: function easing(t) {\n      return 1 - Math.pow(1 - t, 3);\n    },\n    smooth: true,\n    smoothTouch: true\n  });\n  function raf(time) {\n    lenis.raf(time);\n    requestAnimationFrame(raf);\n  }\n  requestAnimationFrame(raf);\n  gsap.ticker.add(function (time) {\n    return lenis.raf(time);\n  });\n  lenis.on('scroll', ScrollTrigger.update);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initLenis);\n\n//# sourceURL=webpack://tomislavvukic.com/./global/lenis-config.js?");

/***/ }),

/***/ "./global/links-hover-effect.js":
/*!**************************************!*\
  !*** ./global/links-hover-effect.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initLinksHover: () => (/* binding */ initLinksHover)\n/* harmony export */ });\nfunction initLinksHover() {\n  document.querySelectorAll('.link').forEach(function (link) {\n    var originalText = link.textContent;\n    var shuffleWord = function shuffleWord(word) {\n      var letters = word.split('');\n      for (var i = letters.length - 1; i > 0; i--) {\n        var j = Math.floor(Math.random() * (i + 1));\n        var _ref = [letters[j], letters[i]];\n        letters[i] = _ref[0];\n        letters[j] = _ref[1];\n      }\n      return letters.join('');\n    };\n    link.addEventListener('mouseenter', function () {\n      var currentText = originalText;\n      var counter = 0;\n      var shuffleInterval = setInterval(function () {\n        if (counter < 3) {\n          currentText = shuffleWord(originalText);\n          link.textContent = currentText;\n          counter++;\n        } else {\n          link.textContent = originalText;\n          clearInterval(shuffleInterval);\n        }\n      }, 100);\n    });\n  });\n}\n\n\n//# sourceURL=webpack://tomislavvukic.com/./global/links-hover-effect.js?");

/***/ }),

/***/ "./work/grid.js":
/*!**********************!*\
  !*** ./work/grid.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initPhotoGrid: () => (/* binding */ initPhotoGrid)\n/* harmony export */ });\nfunction initPhotoGrid() {\n  var photoContainers = Array.from(document.querySelectorAll(\".photo-container\"));\n  var shuffleArray = function shuffleArray(array) {\n    return array.sort(function () {\n      return Math.random() - 0.5;\n    });\n  };\n  var shuffledPhotos = shuffleArray(photoContainers);\n  var leftColumns = [2, 3];\n  var rightColumns = [7, 8];\n  var isLeft = true;\n  var currentRow = 1;\n  shuffledPhotos.forEach(function (container) {\n    var photo = container.querySelector(\".photo\");\n    var isHorizontal = photo.naturalWidth > photo.naturalHeight;\n    var colSpan = isHorizontal ? 3 : 2;\n    var startCol = isLeft ? leftColumns[0] : rightColumns[0];\n    var endCol = startCol + colSpan - 1;\n    container.style.gridColumnStart = startCol;\n    container.style.gridColumnEnd = endCol + 1;\n    container.style.gridRowStart = currentRow;\n    isLeft = !isLeft;\n    currentRow++;\n  });\n  gsap.fromTo(shuffledPhotos, {\n    autoAlpha: 0,\n    scale: 0.8,\n    y: window.innerHeight / 2\n  }, {\n    autoAlpha: 1,\n    scale: 1,\n    y: 0,\n    duration: 0.8,\n    ease: \"power3.out\",\n    stagger: 0.1\n  });\n}\n\n\n//# sourceURL=webpack://tomislavvukic.com/./work/grid.js?");

/***/ }),

/***/ "./work/index.js":
/*!***********************!*\
  !*** ./work/index.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initPhotoGrid: () => (/* reexport safe */ _grid_js__WEBPACK_IMPORTED_MODULE_1__.initPhotoGrid)\n/* harmony export */ });\n/* harmony import */ var _global_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/index.js */ \"./global/index.js\");\n/* harmony import */ var _grid_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid.js */ \"./work/grid.js\");\n\n\n\n\n//# sourceURL=webpack://tomislavvukic.com/./work/index.js?");

/***/ }),

/***/ "./node_modules/@studio-freight/lenis/dist/lenis.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@studio-freight/lenis/dist/lenis.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Lenis)\n/* harmony export */ });\nfunction t(t,e,i){return Math.max(t,Math.min(e,i))}class Animate{advance(e){if(!this.isRunning)return;let i=!1;if(this.lerp)this.value=(s=this.value,o=this.to,n=60*this.lerp,r=e,function(t,e,i){return(1-i)*t+i*e}(s,o,1-Math.exp(-n*r))),Math.round(this.value)===this.to&&(this.value=this.to,i=!0);else{this.currentTime+=e;const s=t(0,this.currentTime/this.duration,1);i=s>=1;const o=i?1:this.easing(s);this.value=this.from+(this.to-this.from)*o}var s,o,n,r;this.onUpdate?.(this.value,i),i&&this.stop()}stop(){this.isRunning=!1}fromTo(t,e,{lerp:i=.1,duration:s=1,easing:o=(t=>t),onStart:n,onUpdate:r}){this.from=this.value=t,this.to=e,this.lerp=i,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,n?.(),this.onUpdate=r}}class Dimensions{constructor({wrapper:t,content:e,autoResize:i=!0,debounce:s=250}={}){this.wrapper=t,this.content=e,i&&(this.debouncedResize=function(t,e){let i;return function(){let s=arguments,o=this;clearTimeout(i),i=setTimeout((function(){t.apply(o,s)}),e)}}(this.resize,s),this.wrapper===window?window.addEventListener(\"resize\",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),window.removeEventListener(\"resize\",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper===window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper===window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}}class Emitter{constructor(){this.events={}}emit(t,...e){let i=this.events[t]||[];for(let t=0,s=i.length;t<s;t++)i[t](...e)}on(t,e){return this.events[t]?.push(e)||(this.events[t]=[e]),()=>{this.events[t]=this.events[t]?.filter((t=>e!==t))}}off(t,e){this.events[t]=this.events[t]?.filter((t=>e!==t))}destroy(){this.events={}}}const e=100/6;class VirtualScroll{constructor(t,{wheelMultiplier:e=1,touchMultiplier:i=1}){this.element=t,this.wheelMultiplier=e,this.touchMultiplier=i,this.touchStart={x:null,y:null},this.emitter=new Emitter,window.addEventListener(\"resize\",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener(\"wheel\",this.onWheel,{passive:!1}),this.element.addEventListener(\"touchstart\",this.onTouchStart,{passive:!1}),this.element.addEventListener(\"touchmove\",this.onTouchMove,{passive:!1}),this.element.addEventListener(\"touchend\",this.onTouchEnd,{passive:!1})}on(t,e){return this.emitter.on(t,e)}destroy(){this.emitter.destroy(),window.removeEventListener(\"resize\",this.onWindowResize,!1),this.element.removeEventListener(\"wheel\",this.onWheel,{passive:!1}),this.element.removeEventListener(\"touchstart\",this.onTouchStart,{passive:!1}),this.element.removeEventListener(\"touchmove\",this.onTouchMove,{passive:!1}),this.element.removeEventListener(\"touchend\",this.onTouchEnd,{passive:!1})}onTouchStart=t=>{const{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit(\"scroll\",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{const{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t,s=-(e-this.touchStart.x)*this.touchMultiplier,o=-(i-this.touchStart.y)*this.touchMultiplier;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:s,y:o},this.emitter.emit(\"scroll\",{deltaX:s,deltaY:o,event:t})};onTouchEnd=t=>{this.emitter.emit(\"scroll\",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:i,deltaY:s,deltaMode:o}=t;i*=1===o?e:2===o?this.windowWidth:1,s*=1===o?e:2===o?this.windowHeight:1,i*=this.wheelMultiplier,s*=this.wheelMultiplier,this.emitter.emit(\"scroll\",{deltaX:i,deltaY:s,event:t})};onWindowResize=()=>{this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight}}class Lenis{constructor({wrapper:t=window,content:e=document.documentElement,wheelEventsTarget:i=t,eventsTarget:s=i,smoothWheel:o=!0,syncTouch:n=!1,syncTouchLerp:r=.075,touchInertiaMultiplier:l=35,duration:h,easing:a=(t=>Math.min(1,1.001-Math.pow(2,-10*t))),lerp:c=!h&&.1,infinite:d=!1,orientation:p=\"vertical\",gestureOrientation:u=\"vertical\",touchMultiplier:m=1,wheelMultiplier:v=1,autoResize:g=!0,__experimental__naiveDimensions:S=!1}={}){this.__isSmooth=!1,this.__isScrolling=!1,this.__isStopped=!1,this.__isLocked=!1,this.onVirtualScroll=({deltaX:t,deltaY:e,event:i})=>{if(i.ctrlKey)return;const s=i.type.includes(\"touch\"),o=i.type.includes(\"wheel\");if(this.options.syncTouch&&s&&\"touchstart\"===i.type&&!this.isStopped&&!this.isLocked)return void this.reset();const n=0===t&&0===e,r=\"vertical\"===this.options.gestureOrientation&&0===e||\"horizontal\"===this.options.gestureOrientation&&0===t;if(n||r)return;let l=i.composedPath();if(l=l.slice(0,l.indexOf(this.rootElement)),l.find((t=>{var e,i,n,r,l;return(null===(e=t.hasAttribute)||void 0===e?void 0:e.call(t,\"data-lenis-prevent\"))||s&&(null===(i=t.hasAttribute)||void 0===i?void 0:i.call(t,\"data-lenis-prevent-touch\"))||o&&(null===(n=t.hasAttribute)||void 0===n?void 0:n.call(t,\"data-lenis-prevent-wheel\"))||(null===(r=t.classList)||void 0===r?void 0:r.contains(\"lenis\"))&&!(null===(l=t.classList)||void 0===l?void 0:l.contains(\"lenis-stopped\"))})))return;if(this.isStopped||this.isLocked)return void i.preventDefault();if(this.isSmooth=this.options.syncTouch&&s||this.options.smoothWheel&&o,!this.isSmooth)return this.isScrolling=!1,void this.animate.stop();i.preventDefault();let h=e;\"both\"===this.options.gestureOrientation?h=Math.abs(e)>Math.abs(t)?e:t:\"horizontal\"===this.options.gestureOrientation&&(h=t);const a=s&&this.options.syncTouch,c=s&&\"touchend\"===i.type&&Math.abs(h)>5;c&&(h=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+h,Object.assign({programmatic:!1},a?{lerp:c?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}))},this.onNativeScroll=()=>{if(!this.__preventNextScrollEvent&&!this.isScrolling){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.velocity=0,this.direction=Math.sign(this.animatedScroll-t),this.emit()}},window.lenisVersion=\"1.0.42\",t!==document.documentElement&&t!==document.body||(t=window),this.options={wrapper:t,content:e,wheelEventsTarget:i,eventsTarget:s,smoothWheel:o,syncTouch:n,syncTouchLerp:r,touchInertiaMultiplier:l,duration:h,easing:a,lerp:c,infinite:d,gestureOrientation:u,orientation:p,touchMultiplier:m,wheelMultiplier:v,autoResize:g,__experimental__naiveDimensions:S},this.animate=new Animate,this.emitter=new Emitter,this.dimensions=new Dimensions({wrapper:t,content:e,autoResize:g}),this.toggleClassName(\"lenis\",!0),this.velocity=0,this.isLocked=!1,this.isStopped=!1,this.isSmooth=n||o,this.isScrolling=!1,this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener(\"scroll\",this.onNativeScroll,!1),this.virtualScroll=new VirtualScroll(s,{touchMultiplier:m,wheelMultiplier:v}),this.virtualScroll.on(\"scroll\",this.onVirtualScroll)}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener(\"scroll\",this.onNativeScroll,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.toggleClassName(\"lenis\",!1),this.toggleClassName(\"lenis-smooth\",!1),this.toggleClassName(\"lenis-scrolling\",!1),this.toggleClassName(\"lenis-stopped\",!1),this.toggleClassName(\"lenis-locked\",!1)}on(t,e){return this.emitter.on(t,e)}off(t,e){return this.emitter.off(t,e)}setScroll(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t}resize(){this.dimensions.resize()}emit(){this.emitter.emit(\"scroll\",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.isStopped=!1,this.reset())}stop(){this.isStopped||(this.isStopped=!0,this.animate.stop(),this.reset())}raf(t){const e=t-(this.time||t);this.time=t,this.animate.advance(.001*e)}scrollTo(e,{offset:i=0,immediate:s=!1,lock:o=!1,duration:n=this.options.duration,easing:r=this.options.easing,lerp:l=!n&&this.options.lerp,onComplete:h,force:a=!1,programmatic:c=!0}={}){if(!this.isStopped&&!this.isLocked||a){if([\"top\",\"left\",\"start\"].includes(e))e=0;else if([\"bottom\",\"right\",\"end\"].includes(e))e=this.limit;else{let t;if(\"string\"==typeof e?t=document.querySelector(e):(null==e?void 0:e.nodeType)&&(t=e),t){if(this.options.wrapper!==window){const t=this.options.wrapper.getBoundingClientRect();i-=this.isHorizontal?t.left:t.top}const s=t.getBoundingClientRect();e=(this.isHorizontal?s.left:s.top)+this.animatedScroll}}if(\"number\"==typeof e){if(e+=i,e=Math.round(e),this.options.infinite?c&&(this.targetScroll=this.animatedScroll=this.scroll):e=t(0,e,this.limit),s)return this.animatedScroll=this.targetScroll=e,this.setScroll(this.scroll),this.reset(),void(null==h||h(this));if(!c){if(e===this.targetScroll)return;this.targetScroll=e}this.animate.fromTo(this.animatedScroll,e,{duration:n,easing:r,lerp:l,onStart:()=>{o&&(this.isLocked=!0),this.isScrolling=!0},onUpdate:(t,e)=>{this.isScrolling=!0,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),c&&(this.targetScroll=t),e||this.emit(),e&&(this.reset(),this.emit(),null==h||h(this),this.__preventNextScrollEvent=!0,requestAnimationFrame((()=>{delete this.__preventNextScrollEvent})))}})}}}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?\"x\":\"y\"]}get isHorizontal(){return\"horizontal\"===this.options.orientation}get actualScroll(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}get scroll(){return this.options.infinite?(t=this.animatedScroll,e=this.limit,(t%e+e)%e):this.animatedScroll;var t,e}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isSmooth(){return this.__isSmooth}set isSmooth(t){this.__isSmooth!==t&&(this.__isSmooth=t,this.toggleClassName(\"lenis-smooth\",t))}get isScrolling(){return this.__isScrolling}set isScrolling(t){this.__isScrolling!==t&&(this.__isScrolling=t,this.toggleClassName(\"lenis-scrolling\",t))}get isStopped(){return this.__isStopped}set isStopped(t){this.__isStopped!==t&&(this.__isStopped=t,this.toggleClassName(\"lenis-stopped\",t))}get isLocked(){return this.__isLocked}set isLocked(t){this.__isLocked!==t&&(this.__isLocked=t,this.toggleClassName(\"lenis-locked\",t))}get className(){let t=\"lenis\";return this.isStopped&&(t+=\" lenis-stopped\"),this.isLocked&&(t+=\" lenis-locked\"),this.isScrolling&&(t+=\" lenis-scrolling\"),this.isSmooth&&(t+=\" lenis-smooth\"),t}toggleClassName(t,e){this.rootElement.classList.toggle(t,e),this.emitter.emit(\"className change\",this)}}\n//# sourceMappingURL=lenis.mjs.map\n\n\n//# sourceURL=webpack://tomislavvukic.com/./node_modules/@studio-freight/lenis/dist/lenis.mjs?");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "tomislavvukic.com:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"work": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktomislavvukic_com"] = self["webpackChunktomislavvukic_com"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./work/index.js");
/******/ 	
/******/ })()
;