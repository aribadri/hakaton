import { injectPreloader } from "./preloader-markup.js";
import {
  createPreloaderTimeline,
  animateProgress,
  hidePreloader,
} from "./preloader-animations.js";

let preloaderElement = null;
let timeline = null;

export const initPreloader = () => {
  preloaderElement = injectPreloader();
  timeline = createPreloaderTimeline();
  timeline.play();

  animateProgress(90, 2.5);

  return preloaderElement;
};

export const completePreloader = (callback) => {
  if (!preloaderElement) return;

  animateProgress(100, 0.5);

  setTimeout(() => {
    hidePreloader(() => {
      if (preloaderElement) {
        preloaderElement.remove();
        preloaderElement = null;
      }
      if (callback) callback();
    });
  }, 500);
};

export const getPreloaderElement = () => preloaderElement;
