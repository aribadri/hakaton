import gsap from "gsap";

export const createPreloaderTimeline = () => {
  const tl = gsap.timeline({ paused: true });

  tl.from(".preloader-logo", {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)",
  })
    .to(
      ".logo-svg",
      {
        scale: 1.1,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
      "-=0.3"
    )
    .from(
      ".character-left",
      {
        x: -100,
        opacity: 0,
        rotation: -20,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.8"
    )
    .from(
      ".character-center",
      {
        scale: 0,
        autoAlpha: 0,
        duration: 1.0,
        ease: "back.out(1.7)",
      },
      "-=1.0"
    )
    .from(
      ".character-right",
      {
        x: 100,
        opacity: 0,
        rotation: 20,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=1.0"
    )
    .from(
      ".preloader-text",
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .from(
      ".preloader-progress",
      {
        scaleX: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2"
    );

  return tl;
};

export const animateProgress = (target = 100, duration = 2) => {
  const progressBar = document.querySelector(".progress-bar");
  const percentLabel = document.querySelector(".loading-percent");

  if (!progressBar || !percentLabel) return;

  gsap.to(progressBar, {
    width: `${target}%`,
    duration: duration,
    ease: "power1.inOut",
  });

  gsap.to(
    { value: 0 },
    {
      value: target,
      duration: duration,
      ease: "power1.inOut",
      onUpdate: function () {
        percentLabel.textContent = `${Math.round(this.targets()[0].value)}%`;
      },
    }
  );
};

export const hidePreloader = (onComplete) => {
  const tl = gsap.timeline({ onComplete });

  tl.to(".preloader-content", {
    scale: 0.95,
    opacity: 0,
    duration: 0.5,
    ease: "power2.in",
  }).to(
    "#ar-preloader",
    {
      opacity: 0,
      duration: 0.3,
      ease: "power1.in",
    },
    "-=0.2"
  );

  return tl;
};
