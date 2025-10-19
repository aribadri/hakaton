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
import { initMask, showMask, hideMask } from "./components/mask/mask.js";
import { startFaceScene, stopFaceScene } from "./faceScene.js";


AFRAME.registerComponent("screenshot-ui", getScreenshot);
AFRAME.registerComponent("custom-animation", animate);

let faceMode = false;
let arSystem;
let activeTargetsCount = 0;
let scannerTimeout = null;

const showScanner = () => {
  const scanner = document.querySelector("#custom-scanner");
  if (scanner) {
    scanner.classList.remove("hidden");
  }
};

const hideScanner = () => {
  const scanner = document.querySelector("#custom-scanner");
  if (scanner) {
    scanner.classList.add("hidden");
  }
};

const setContent = () => {
  const groupTrio = [0, 1, 2, 3];
  const groupVolk = [4, 5, 6];

  for (let i = 0; i <= 6; i++) {
    const anchor = document.querySelector("#anchor-" + i);
    anchor.addEventListener("targetFound", () => {
      activeTargetsCount++;

      if (scannerTimeout) {
        clearTimeout(scannerTimeout);
        scannerTimeout = null;
      }

      hideScanner();

      if (groupTrio.includes(i)) {
        anchor.insertAdjacentHTML("beforeend", config.trioTemplate);
      }
      if (groupVolk.includes(i)) {
        anchor.insertAdjacentHTML("beforeend", config.volkTemplate);
      }
    });

    anchor.addEventListener("targetLost", () => {
      // Уменьшаем счетчик активных таргетов
      activeTargetsCount--;

      if (groupTrio.includes(i)) {
        const existing = anchor.querySelector(".target-trio-content");
        if (existing) anchor.removeChild(existing);
      }
      if (groupVolk.includes(i)) {
        const existing = anchor.querySelector(".target-volk-content");
        if (existing) anchor.removeChild(existing);
      }

      // Если нет активных таргетов, запускаем таймаут на показ сканера
      if (activeTargetsCount <= 0) {
        activeTargetsCount = 0;

        if (scannerTimeout) {
          clearTimeout(scannerTimeout);
        }

        scannerTimeout = setTimeout(() => {
          showScanner();
          scannerTimeout = null;
        }, 1000);
      }
    });
  }
};

const onArReady = async (e) => {
  // startMask()
  // if (arSystem) {
  //   await arSystem.stop(); // Останавливаем image tracking
  // }
  // document.querySelector("#scene-image").classList.add("hidden");
  // startMask(); // Запускаем face tracking с маской
  // return

  completePreloader();

  if (arSystem) return;

  const models = document.querySelectorAll(".models");

  const closeBtn = document.querySelector("#panoramaCloseBtn");
  const canvas = document.querySelector(".panorama");
  const rightBTN = document.querySelector(".btn-right");
  const leftBTN = document.querySelector(".btn-left");
  const panBtn = document.querySelector("#panoramaBtn");
  const maskBtn = document.querySelector("#maskBtn");

  arSystem = e.target.systems["mindar-image-system"];

  panBtn.classList.remove("hidden");

  // Mask button - show in AR mode
  maskBtn.classList.remove("hidden");

  // Quiz button
  const quizBtn = document.querySelector("#quizBtn");
  quizBtn.classList.remove("hidden");

  e.target.setAttribute("screenshot-ui", "");
  e.target.renderer.setClearColor(0x000000, 0);

  models.forEach((model) => {
    model.setAttribute("custom-animation", "");
  });

  await preloadTextures(config.panoList);

  let panoramaInitialized = false;

  panBtn.addEventListener("click", async () => {
    arSystem.stop();

    if (!panoramaInitialized) {
      panoramaInitialized = true;

      let hasPermission = true;
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        try {
          const response = await DeviceOrientationEvent.requestPermission();
          hasPermission = response === "granted";
        } catch (error) {
          console.error("Permission request failed:", error);
          hasPermission = false;
        }
      }

      startPanorama(hasPermission);
    }

    closeBtn.classList.remove("hidden");
    canvas.classList.remove("hidden");
    leftBTN.classList.remove("hidden");
    rightBTN.classList.remove("hidden");

    maskBtn.classList.add("hidden");
  });

  maskBtn.addEventListener("click", async () => {
    if (!faceMode) {
      if (arSystem) await arSystem.pause();
      hideScanner();
      showMask();
      await startFaceScene();
      faceMode = true;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initScanner();
  initMask();
  setContent();

  const landscapeWarning = document.getElementById("landscapeWarning");

  const checkOrientation = () => {
    if (window.matchMedia("(orientation: landscape)").matches) {
      landscapeWarning.classList.remove("hidden");
    } else {
      landscapeWarning.classList.add("hidden");
    }
  };

  checkOrientation();

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);

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

  const sceneEl = document.querySelector("#scene-image");
  sceneEl.addEventListener("arReady", onArReady);

  // _____ПЕРЕКЛЮЧАЕМ РЕЖИМ С IMAGE на FACE___________
  const maskCloseBtn = document.querySelector("#maskCloseBtn");
  maskCloseBtn.addEventListener("click", async () => {
    if (faceMode) {
      await stopFaceScene();
      hideMask();
      showScanner();
      if (arSystem) arSystem.unpause();
      faceMode = false;
    }
  });

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
