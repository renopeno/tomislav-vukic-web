function initAbout() {

  gsap.registerPlugin(ScrollTrigger);

  const aboutTitle = document.querySelector('.about-title');
//   const aboutBody = document.querySelector('.about-small-title');

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

  const aboutParagraph = document.querySelector('.about-paragraph');
  const paragraphText = new SplitType(aboutParagraph, { 
      types: ['words', 'chars'],
      tagName: 'span'
  });

  paragraphText.words.forEach(word => {
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
                      markers: true,
                  }
              }
          );

          gsap.fromTo(paragraphText.chars, { opacity: 0 }, {
              opacity: 1,
              duration: 0.3,
              stagger: 0.02,
              scrollTrigger: {
                  trigger: aboutParagraph,
                  start: "top 60%",
                  end: "top 40%",
                  scrub: true,
                  markers: true,
              }
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
                      start: "top 40%",
                      end: "bottom 30%",
                      scrub: true,
                      markers: false,
                  }
              }
          );

          gsap.fromTo([paragraphText.chars], { opacity: 0 }, {
              opacity: 1,
              duration: 0.3,
              stagger: 0.02,
              scrollTrigger: {
                  trigger: aboutParagraph,
                  start: "top 40%",
                  end: "top 20%",
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