function initAbout() {
    if (typeof gsap === 'undefined' || typeof SplitType === 'undefined') {
      console.error('GSAP ili SplitType nisu učitani');
      return;
    }
  
    gsap.registerPlugin(ScrollTrigger);
  
    // Dohvati elemente
    const aboutTitle = document.querySelector('.about-title');
    const aboutBody = document.querySelector('.body.about');
  
    // Postavi početno stanje
    gsap.set([aboutTitle, aboutBody], { 
        autoAlpha: 0, 
        y: window.innerHeight / 2 
    });
  
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
  
    // Sequence reveal animations
    gsap.fromTo(
      aboutTitle,
      { 
        autoAlpha: 0, 
        scale: 0.8, 
        y: window.innerHeight / 2 
      },
      { 
        autoAlpha: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out"
      }
    );
  
    gsap.fromTo(
      aboutBody,
      { 
        autoAlpha: 0, 
        y: 0,
        scale: 1,
      },
      { 
        autoAlpha: 1,  
        y: 0, 
        // duration: 0.3, 
        ease: "power3.out",
        delay: 0.35, // Mali delay nakon title-a
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      }
    );
  
    // Scroll animations
    const scrollAnimations = () => {
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
            start: "top 40%",
            end: "top center",
            scrub: true,
            markers: false,
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
            markers: false,
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
            end: "top 40%",
            scrub: true,
            markers: false,
          }
        }
      );
    };
  
    // Inicijaliziraj scroll animacije
    scrollAnimations();
  
    // Cleanup funkcija
    return () => {
      // Kill sve ScrollTrigger instance
      ScrollTrigger.getAll().forEach(t => t.kill());
      // Kill sve split instance
      titleText.revert();
      leftText.revert();
      rightText.revert();
    };
  }
  
  initAbout();