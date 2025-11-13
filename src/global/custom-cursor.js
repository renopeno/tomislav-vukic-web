// src/global/custom-cursor.js
// Custom cursor - crna točka (bijela u dark mode-u)

export function initCustomCursor() {
  // Kreiraj cursor element
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease, border-radius 0.2s ease, opacity 0.2s ease;
    background-color: #ffffff;
    mix-blend-mode: difference;
  `;
  
  // State tracking
  let isHovering = false;
  let isHoveringCarousel = false;
  let isDragging = false;
  
  // Update cursor style based on state
  const updateCursorStyle = () => {
    if (isDragging) {
      // Drag state: 56x32px pill shape (veliki)
      cursor.style.width = '56px';
      cursor.style.height = '32px';
      cursor.style.borderRadius = '999px'; // Full radius (pill)
      cursor.style.opacity = '1';
    } else if (isHoveringCarousel || isHovering) {
      // Hover state (carousel ili interaktivni elementi): 32x32px circle, opacity 0.2
      cursor.style.width = '32px';
      cursor.style.height = '32px';
      cursor.style.borderRadius = '50%';
      cursor.style.opacity = '0.2';
      cursor.style.mixBlendMode = 'difference'; // Osiguraj blend mode
    } else {
      // Default state: 10x10px dot
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursor.style.borderRadius = '50%';
      cursor.style.opacity = '1';
    }
  };
  
  updateCursorStyle();
  document.body.appendChild(cursor);
  
  // Sakrij default cursor
  document.body.style.cursor = 'none';
  
  // Dodaj CSS za sakrivanje default cursor-a na svim elementima
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      cursor: none !important;
    }
  `;
  document.head.appendChild(style);
  
  // Prati poziciju miša - MINIMALNI smoothing
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  const speed = 0.25; // Povećan smoothness (0.25 = vidljivi smooth efekt)
  
  const updateMousePosition = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  
  const animateCursor = () => {
    // Minimalni smooth interpolation
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  };
  
  // Detect hover over interactive elements
  const interactiveSelectors = `
    a, 
    button, 
    input, 
    textarea, 
    select, 
    [role="button"], 
    [data-cursor-hover],
    .nav-theme-switcher,
    .ui-dark-toggle,
    .work-photo,
    .photo-item,
    [class*="photo"],
    [class*="image"],
    [class*="theme"],
    [class*="toggle"],
    [onclick],
    [class*="clickable"],
    [class*="interactive"]
  `;
  
  const checkHover = (e) => {
    const target = e.target;
    const isInteractive = target.closest(interactiveSelectors.trim());
    const isCanvas = target.tagName === 'CANVAS'; // Detektiraj carousel canvas
    
    // Carousel hover - SAMO u vertikalnom range-u carousela (centar ekrana ±30%)
    if (isCanvas && !isDragging) {
      const viewportHeight = window.innerHeight;
      const mouseY = e.clientY;
      const centerY = viewportHeight / 2;
      const allowedRange = viewportHeight * 0.3; // ±30% od centra
      
      const isInCarouselArea = Math.abs(mouseY - centerY) < allowedRange;
      
      if (isInCarouselArea) {
        if (!isHoveringCarousel) {
          isHoveringCarousel = true;
          updateCursorStyle();
        }
      } else {
        if (isHoveringCarousel) {
          isHoveringCarousel = false;
          updateCursorStyle();
        }
      }
    } else {
      if (isHoveringCarousel) {
        isHoveringCarousel = false;
        updateCursorStyle();
      }
    }
    
    // Interaktivni elementi hover
    if (isInteractive && !isDragging && !isCanvas) {
      if (!isHovering) {
        isHovering = true;
        updateCursorStyle();
      }
    } else {
      if (isHovering) {
        isHovering = false;
        updateCursorStyle();
      }
    }
  };
  
  // Listen for drag events (custom events from hero.js)
  const dragStartHandler = () => {
    isDragging = true;
    updateCursorStyle();
  };
  
  const dragEndHandler = () => {
    isDragging = false;
    updateCursorStyle();
  };
  
  window.addEventListener('hero:drag:start', dragStartHandler);
  window.addEventListener('hero:drag:end', dragEndHandler);
  
  // Event listeners
  const mousemoveHandler = (e) => {
    updateMousePosition(e);
    checkHover(e);
  };
  
  window.addEventListener('mousemove', mousemoveHandler);
  
  // Pokreni animaciju
  animateCursor();
  
  // Cleanup function
  return () => {
    cursor.remove();
    style.remove();
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', mousemoveHandler);
    window.removeEventListener('hero:drag:start', dragStartHandler);
    window.removeEventListener('hero:drag:end', dragEndHandler);
  };
}

