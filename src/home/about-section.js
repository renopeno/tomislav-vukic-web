function initAboutSection() {
  const homeAboutTitle = document.querySelector('.home-about-title');
  const aboutScroll = document.querySelector('.about-scroll');

  if (!homeAboutTitle || !aboutScroll) return;

  gsap.registerPlugin(ScrollTrigger);

  // Split text u riječi
  const titleSplit = new SplitType(homeAboutTitle, { types: 'words' });
  const scrollSplit = new SplitType(aboutScroll, { types: 'words' });

  // CSS za masked slide-up efekt
  const style = document.createElement('style');
  style.textContent = `
    .word {
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
    }
    .word-inner {
      display: inline-block;
      opacity: 0.1;
      transform: translateY(100%);
    }
  `;
  document.head.appendChild(style);

  // Wrap svaku riječ u inner span za slide-up efekt
  const wrapWords = (words) => {
    words.forEach(word => {
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = word.textContent;
      word.textContent = '';
      word.appendChild(inner);
    });
  };

  wrapWords(titleSplit.words);
  wrapWords(scrollSplit.words);

  // Prvih 6 riječi već revealed
  titleSplit.words.slice(0, 6).forEach(word => {
    const inner = word.querySelector('.word-inner');
    gsap.set(inner, { opacity: 1, y: 0 });
  });

  // Masked reveal za title - slide up from bottom (BEZ SCRUB-a)
  const titleTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: homeAboutTitle,
      start: "top 70%",
      end: "bottom 30%",
      scrub: false,
      toggleActions: "play none none reverse",
      id: "about-title",
      onEnter: () => console.log('🎬 ABOUT TITLE: onEnter'),
      onLeave: () => console.log('🚪 ABOUT TITLE: onLeave'),
      onEnterBack: () => console.log('⬅️ ABOUT TITLE: onEnterBack'),
      onLeaveBack: () => console.log('⬆️ ABOUT TITLE: onLeaveBack'),
      onUpdate: (self) => {
        if (self.direction === -1) {
          console.log('🔙 ABOUT TITLE: Scrolling BACK, progress:', self.progress.toFixed(2));
        }
      }
    }
  });

  titleTimeline.to(titleSplit.words.slice(6).map(w => w.querySelector('.word-inner')), {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.015,
    ease: "power2.out",
    onStart: () => console.log('▶️ ABOUT TITLE animation START'),
    onComplete: () => console.log('✅ ABOUT TITLE animation COMPLETE'),
    onReverseComplete: () => console.log('⏮️ ABOUT TITLE animation REVERSE COMPLETE')
  });

  // Masked reveal za scroll text - slide up from bottom (BEZ SCRUB-a)
  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: aboutScroll,
      start: "top 70%",
      end: "bottom 30%",
      scrub: false,
      toggleActions: "play none none reverse",
      id: "about-scroll",
      onEnter: () => console.log('🎬 ABOUT SCROLL: onEnter'),
      onLeave: () => console.log('🚪 ABOUT SCROLL: onLeave'),
      onEnterBack: () => console.log('⬅️ ABOUT SCROLL: onEnterBack'),
      onLeaveBack: () => console.log('⬆️ ABOUT SCROLL: onLeaveBack'),
      onUpdate: (self) => {
        if (self.direction === -1) {
          console.log('🔙 ABOUT SCROLL: Scrolling BACK, progress:', self.progress.toFixed(2));
        }
      }
    }
  });

  scrollTimeline.to(scrollSplit.words.map(w => w.querySelector('.word-inner')), {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.015,
    ease: "power2.out",
    onStart: () => console.log('▶️ ABOUT SCROLL animation START'),
    onComplete: () => console.log('✅ ABOUT SCROLL animation COMPLETE'),
    onReverseComplete: () => console.log('⏮️ ABOUT SCROLL animation REVERSE COMPLETE')
  });
}

window.initAboutSection = initAboutSection;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutSection);
} else {
  initAboutSection();
}
