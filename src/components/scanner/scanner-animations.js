import { gsap } from "gsap";

export const initScannerAnimations = () => {
  // Пульсация рамки (уменьшенная амплитуда)
  gsap.to('.film-frame', {
    scale: 1.02,
    duration: 1.5,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  });

  // Анимация сканирующей линии
  gsap.to('.scan-line', {
    top: '100%',
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
  });

  // Мигание перфорации
  gsap.to('.perforation-hole', {
    opacity: 0.3,
    duration: 0.8,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.1,
      from: 'random'
    }
  });

  // Анимация иконки камеры
  gsap.to('.vintage-camera', {
    y: -10,
    duration: 2,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  });

  // Вращение лучей камеры
  gsap.to('.camera-rays', {
    rotation: 360,
    transformOrigin: '60px 70px',
    duration: 4,
    ease: 'none',
    repeat: -1
  });

  // Анимация объектива (пульсация)
  gsap.to('.vintage-camera circle:nth-of-type(1)', {
    attr: { r: 22 },
    duration: 1.5,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  });

  // Мигание вспышки
  gsap.to('.vintage-camera rect:nth-of-type(2)', {
    opacity: 0.5,
    duration: 0.5,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  });
};
