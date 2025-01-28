function initAbout() {
    if (typeof gsap === 'undefined' || typeof SplitType === 'undefined') {
      console.error('GSAP ili SplitType nisu učitani');
      return;
    }
  
    gsap.registerPlugin(ScrollTrigger);
  
    // Title animation
    const title = document.querySelector('.reveal-type');
    const titleText = new SplitType(title, { 
      types: ['words', 'chars'],
      tagName: 'span'
    });
  
    if (titleText.chars && titleText.chars[0]) {
      titleText.chars[0].style.marginLeft = '16vw';
    }
  
    titleText.words.forEach(word => {
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
    });
  
    // Left paragraph
    const leftParagraph = document.querySelector('[data-about-paragraph="left"]');
    const leftText = new SplitType(leftParagraph, { 
      types: ['words', 'chars'],
      tagName: 'span'
    });
  
    leftText.words.forEach(word => {
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
    });
  
    // Right paragraph
    const rightParagraph = document.querySelector('[data-about-paragraph="right"]');
    const rightText = new SplitType(rightParagraph, { 
      types: ['words', 'chars'],
      tagName: 'span'
    });
  
    rightText.words.forEach(word => {
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
    });
  
    // Set initial states
    gsap.set(titleText.chars, {
      opacity: 0.15
    });
    
    gsap.set([leftText.chars, rightText.chars], {
      opacity: 0
    });
  
    // Title animation
    gsap.fromTo(titleText.chars, 
      { opacity: 0.15 },
      {
        opacity: 1,
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: {
          trigger: ".about-reveal-start",
          endTrigger: ".about-reveal-end",
          start: "top center",
          end: "top center",
          scrub: true,
          markers: true
        }
      }
    );
  
    // Left paragraph animation
    gsap.fromTo(leftText.chars,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: {
          trigger: leftParagraph,
          start: "top 60%",
          end: "top 40%",
          scrub: true,
          markers: true,
        }
      }
    );
  
    // Right paragraph animation
    gsap.fromTo(rightText.chars,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: {
          trigger: rightParagraph,
          start: "top 50%",
          end: "top 30%",
          scrub: true,
          markers: true,
        }
      }
    );
  }
  
  initAbout();