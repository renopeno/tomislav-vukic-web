// Detaljni debug sustav za scroll probleme
const ScrollDebugger = {
  enabled: false, // Isključeno - problem pronađen!
  logs: [],
  lastScrollY: 0,
  lastTimestamp: 0,
  freezeThreshold: 100, // ms - ako frame traje duže od ovoga, log kao freeze
  
  init() {
    if (!this.enabled) return;
    
    console.log('🔍 ScrollDebugger aktiviran');
    
    // Track Lenis scroll events
    if (window.lenis) {
      window.lenis.on('scroll', (e) => {
        this.logScroll('LENIS', e);
      });
    }
    
    // Track ScrollTrigger updates
    if (window.ScrollTrigger) {
      ScrollTrigger.addEventListener('refresh', () => {
        console.log('🔄 ScrollTrigger REFRESH event');
      });
      
      ScrollTrigger.addEventListener('scrollStart', () => {
        console.log('▶️ ScrollTrigger SCROLL START');
      });
      
      ScrollTrigger.addEventListener('scrollEnd', () => {
        console.log('⏸️ ScrollTrigger SCROLL END');
      });
    }
    
    // Track RAF performance
    this.startRAFMonitoring();
    
    // Track scroll direction changes
    this.trackScrollDirection();
    
    console.log('✅ ScrollDebugger setup complete');
  },
  
  logScroll(source, data) {
    const now = performance.now();
    const delta = now - this.lastTimestamp;
    const scrollDelta = data.scroll - this.lastScrollY;
    const direction = scrollDelta > 0 ? '⬇️ DOWN' : '⬆️ UP';
    
    // Detektuj freeze
    if (delta > this.freezeThreshold && this.lastTimestamp > 0) {
      console.warn(`🚨 FREEZE DETECTED! ${delta.toFixed(2)}ms gap`, {
        scrollPosition: data.scroll,
        direction,
        gap: `${delta.toFixed(2)}ms`,
        scrollDelta
      });
    }
    
    // Log normalan scroll
    if (Math.abs(scrollDelta) > 1) {
      console.log(`📜 ${source} ${direction}`, {
        scroll: data.scroll.toFixed(2),
        velocity: data.velocity?.toFixed(2) || 'N/A',
        delta: scrollDelta.toFixed(2),
        time: delta.toFixed(2) + 'ms'
      });
    }
    
    this.lastScrollY = data.scroll;
    this.lastTimestamp = now;
  },
  
  startRAFMonitoring() {
    let lastRAFTime = performance.now();
    let frameCount = 0;
    
    const monitorRAF = (timestamp) => {
      const delta = timestamp - lastRAFTime;
      
      // Detektuj spore frame-ove
      if (delta > 32) { // Više od ~30fps
        console.warn(`⏱️ SLOW FRAME: ${delta.toFixed(2)}ms (${(1000/delta).toFixed(1)}fps)`, {
          framesSinceLastLog: frameCount,
          scrollY: window.lenis?.scroll || window.scrollY
        });
      }
      
      frameCount++;
      lastRAFTime = timestamp;
      requestAnimationFrame(monitorRAF);
    };
    
    requestAnimationFrame(monitorRAF);
  },
  
  trackScrollDirection() {
    let lastDirection = null;
    
    const check = () => {
      const scrollY = window.lenis?.scroll || window.scrollY;
      const direction = scrollY > this.lastScrollY ? 'down' : 'up';
      
      if (direction !== lastDirection && lastDirection !== null) {
        console.log(`🔄 DIRECTION CHANGE: ${lastDirection} → ${direction}`, {
          scrollY: scrollY.toFixed(2),
          activeScrollTriggers: ScrollTrigger.getAll().length
        });
      }
      
      lastDirection = direction;
      requestAnimationFrame(check);
    };
    
    requestAnimationFrame(check);
  },
  
  logScrollTriggers() {
    const triggers = ScrollTrigger.getAll();
    console.log(`📊 Active ScrollTriggers: ${triggers.length}`);
    triggers.forEach(trigger => {
      console.log(`  - ${trigger.vars.id || 'unnamed'}`, {
        start: trigger.start,
        end: trigger.end,
        progress: trigger.progress.toFixed(2),
        isActive: trigger.isActive
      });
    });
  }
};

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ScrollDebugger.init());
} else {
  ScrollDebugger.init();
}

// Expose globally za console pristup
window.ScrollDebugger = ScrollDebugger;

// Dodaj keyboard shortcut za logging trenutnog stanja
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Shift + D za dump stanja
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
    console.log('🔍 === SCROLL DEBUG DUMP ===');
    ScrollDebugger.logScrollTriggers();
    console.log('Lenis state:', {
      scroll: window.lenis?.scroll,
      velocity: window.lenis?.velocity,
      direction: window.lenis?.direction
    });
    console.log('=========================');
  }
});

