function initAbout() {

  gsap.registerPlugin(ScrollTrigger);

  const aboutTitle = document.querySelector('.about-title');
  const aboutBody = document.querySelector('.about-small-title');

  const title = document.querySelector('.reveal-type');
  const titleText = new SplitType(title, { 
      types: ['words', 'chars'],
      tagName: 'span'
  });

  if (titleText.chars && titleText.chars[0]) {
      titleText.chars[0].style.marginLeft = '12vw';
  }

  titleText.words.forEach(word => {
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
  });

  const leftParagraph = document.querySelector('[data-about-paragraph="left"]');
  const leftText = new SplitType(leftParagraph, { 
      types: ['words', 'chars'],
      tagName: 'span'
  });

  leftText.words.forEach(word => {
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
  });

  const rightParagraph = document.querySelector('[data-about-paragraph="right"]');
  const rightText = new SplitType(rightParagraph, { 
      types: ['words', 'chars'],
      tagName: 'span'
  });

  rightText.words.forEach(word => {
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
  });


  const timeline = gsap.timeline({
      onComplete: () => {
          console.log('✅ About: All reveal animations complete');
          ScrollTrigger.refresh();
      }
  });


  // Intro fade in animacija za title i /about label
  timeline
    .fromTo(aboutTitle, 
      {
        opacity: 0, y: window.innerHeight / 5,
      },
      { 
        opacity: 1, y: 0, duration: 0.5, ease: "power1.out",
      });
    // .fromTo(aboutBody, 
    //   {
    //     opacity: 0,
    //   }, 
    //   { 
    //     opacity: 1, ease: "power1.out", duration: 0.3,
    //   }, "-=0.45");


  // Scroll reveal animacija za title i paragraphove
  const scrollAnimations = () => {
      gsap.matchMedia().add("(min-width: 768px)", () => {
          gsap.fromTo(titleText.chars, 
              { opacity: 0.15 },
              {
                  opacity: 1,
                  duration: 0.3,
                  stagger: 0.02,
                  scrollTrigger: {
                      trigger: ".about-reveal-start",
                      endTrigger: ".about-reveal-end",
                      start: "top 50%",
                      end: "top center",
                      scrub: true,
                      markers: false,
                  }
              }
          );

          gsap.fromTo(leftText.chars, { opacity: 0 }, {
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
          });

          gsap.fromTo(rightText.chars, { opacity: 0 }, {
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
          });
      });

      // Mobile animacije
      gsap.matchMedia().add("(max-width: 767px)", () => {
          gsap.fromTo(titleText.chars, 
              { opacity: 0.15 },
              {
                  opacity: 1,
                  duration: 0.3,
                  stagger: 0.02,
                  scrollTrigger: {
                      trigger: ".about-reveal-start",
                      start: "top 35%",
                      end: "top center",
                      scrub: true,
                      markers: false,
                  }
              }
          );

          gsap.fromTo([leftText.chars, rightText.chars], { opacity: 0 }, {
              opacity: 1,
              duration: 0.3,
              stagger: 0.02,
              scrollTrigger: {
                  trigger: leftParagraph,
                  start: "top 50%",
                  end: "bottom 40%",
                  scrub: true,
                  markers: false,
              }
          });
      });
  };

  scrollAnimations();

  console.log(`ℹ️ About initialized, scroll position: ${window.scrollY}px`);
}
initAbout();