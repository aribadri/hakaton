import { getScreenshot } from "./components/screenshot.js";
import { animate } from "./components/animation.js";
import { preloadTextures, startPanorama } from "./panorama";
import config from "./config.js";
import {
  initPreloader,
  completePreloader,
} from "./components/preloader/preloader.js";
import { initScanner } from "./components/scanner/scanner.js";
import { Quiz } from "./components/quiz/quiz.js";

AFRAME.registerComponent("screenshot-ui", getScreenshot);
AFRAME.registerComponent("custom-animation", animate);

let arSystem;

const setContent = () => {
  const groupTrio = [0, 1, 2, 3];
  const groupVolk = [4, 5, 6];

  for (let i = 0; i <= 6; i++) {
    const anchor = document.querySelector("#anchor-" + i);
    anchor.addEventListener("targetFound", () => {
      if (groupTrio.includes(i)) {
        anchor.insertAdjacentHTML("beforeend", config.trioTemplate);
      }
      if (groupVolk.includes(i)) {
        anchor.insertAdjacentHTML("beforeend", config.volkTemplate);
      }
    });

    anchor.addEventListener("targetLost", () => {
      if (groupTrio.includes(i)) {
        const existing = anchor.querySelector(".target-trio-content");
        if (existing) anchor.removeChild(existing);
      }
      if (groupVolk.includes(i)) {
        const existing = anchor.querySelector(".target-volk-content");
        if (existing) anchor.removeChild(existing);
      }
    });
  }
};

const onArReady = async (e) => {
  completePreloader();

  if (arSystem) return;

  const models = document.querySelectorAll(".models");

  const closeBtn = document.querySelector("#panoramaCloseBtn");
  const canvas = document.querySelector(".panorama");
  const rightBTN = document.querySelector(".btn-right");
  const leftBTN = document.querySelector(".btn-left");
  const panBtn = document.querySelector("#panoramaBtn");

  arSystem = e.target.systems["mindar-image-system"];

  panBtn.classList.remove("hidden");

  // Quiz button
  const quizBtn = document.querySelector("#quizBtn");
  quizBtn.classList.remove("hidden");

  e.target.setAttribute("screenshot-ui", "");

  models.forEach((model) => {
    model.setAttribute("custom-animation", "");
  });

  await preloadTextures(config.panoList);

  startPanorama(true);
  // e.target.addEventListener("deviceorientationpermissionrequested", (e) => {
  // });
  // e.target.addEventListener("deviceorientationpermissionrejected", () => {
  //   startPanorama(false);
  // });

  panBtn.addEventListener("click", () => {
    arSystem.stop();
    closeBtn.classList.remove("hidden");
    canvas.classList.remove("hidden");
    leftBTN.classList.remove("hidden");
    rightBTN.classList.remove("hidden");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initScanner();
  setContent();

  // Quiz
  const quiz = new Quiz();
  const quizBtn = document.querySelector("#quizBtn");
  quizBtn.addEventListener("click", () => {
    if (arSystem) {
      arSystem.pause();
    }
    quiz.open();
  });

  const quizCloseBtn = document.getElementById("quizCloseBtn");
  quizCloseBtn.addEventListener("click", () => {
    if (arSystem) {
      arSystem.unpause();
    }
  });

  const sceneEl = document.querySelector("a-scene");
  sceneEl.addEventListener("arReady", onArReady);

  const observer = new MutationObserver(() => {
    const dialogText = document.querySelector(".a-dialog-text");
    if (
      dialogText &&
      (dialogText.textContent.includes("immersive") ||
        dialogText.textContent.includes("HTTPS") ||
        dialogText.textContent.includes("device sensors"))
    ) {
      if (dialogText.textContent.includes("HTTPS")) {
        dialogText.textContent =
          "Откройте этот сайт по HTTPS для входа в VR режим и предоставления доступа к датчикам устройства.";
      } else {
        dialogText.textContent =
          "Это иммерсивное приложение требует доступа к датчикам ориентации устройства для полноценной работы.";
      }
      const allowBtn = document.querySelector(".a-dialog-allow-button");
      const denyBtn = document.querySelector(".a-dialog-deny-button");
      const okBtn = document.querySelector(".a-dialog-ok-button");
      if (allowBtn) allowBtn.textContent = "Разрешить";
      if (denyBtn) denyBtn.textContent = "Отклонить";
      if (okBtn) okBtn.textContent = "ОК";
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
