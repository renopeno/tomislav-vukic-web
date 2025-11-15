// src/global/custom-cursor.js
// Custom cursor - prikazuje se SAMO prilikom drag-a carousel-a

export function initCustomCursor() {
  // Ne prikazuj custom cursor na touch devices (mobitel/tablet)
  const isTouchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
  
  if (isTouchDevice) {
    console.log('🖱️ Touch device detektiran - custom cursor onemogućen');
    return; // Ne inicijaliziraj cursor na touch devices
  }
  
  // Kreiraj cursor element - SAKRIVEN po defaultu
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 56px;
    height: 32px;
    border-radius: 999px;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s ease;
    background-color: #ffffff;
    mix-blend-mode: difference;
    opacity: 0;
    display: none;
  `;
  
  document.body.appendChild(cursor);
  
  // Prati poziciju miša
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  const updateMousePosition = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  };
  
  // Listen for drag events (custom events from hero.js)
  const dragStartHandler = () => {
    cursor.style.display = 'block';
    // Delay opacity za smooth prijelaz
    setTimeout(() => {
      cursor.style.opacity = '1';
    }, 10);
  };
  
  const dragEndHandler = () => {
    cursor.style.opacity = '0';
    // Sakrij nakon fade-out animacije
    setTimeout(() => {
      cursor.style.display = 'none';
    }, 200);
  };
  
  window.addEventListener('hero:drag:start', dragStartHandler);
  window.addEventListener('hero:drag:end', dragEndHandler);
  
  // Event listener za poziciju
  const mousemoveHandler = (e) => {
    updateMousePosition(e);
  };
  
  window.addEventListener('mousemove', mousemoveHandler);
  
  // Cleanup function
  return () => {
    cursor.remove();
    window.removeEventListener('mousemove', mousemoveHandler);
    window.removeEventListener('hero:drag:start', dragStartHandler);
    window.removeEventListener('hero:drag:end', dragEndHandler);
  };
}

