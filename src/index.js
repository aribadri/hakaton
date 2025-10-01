import { getScreenshot } from "./components/screenshot.js";
import { animate } from "./components/animation.js";
import { preloadTextures, startPanorama } from "./panorama";
import config from "./config.js";
import {
  initPreloader,
  completePreloader,
} from "./components/preloader/preloader.js";

AFRAME.registerComponent("screenshot-ui", getScreenshot);
AFRAME.registerComponent("custom-animation", animate);

let arSystem;

const onArReady = async (e) => {
  completePreloader();

  if (arSystem) return;
  
  const robotModel = document.querySelector("#robot");
  const guitarModel = document.querySelector("#guitar");

  const closeBtn = document.querySelector("#panoramaCloseBtn");
  const canvas = document.querySelector(".panorama");
  const rightBTN = document.querySelector(".btn-right");
  const leftBTN = document.querySelector(".btn-left");
  const panBtn = document.querySelector("#panoramaBtn");

  arSystem = e.target.systems["mindar-image-system"];

  panBtn.classList.remove("hidden");

  e.target.setAttribute("screenshot-ui", "");
  robotModel.setAttribute("custom-animation", "");
  guitarModel.setAttribute("custom-animation", "");

  await preloadTextures(config.panoList);
  startPanorama();

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

  const sceneEl = document.querySelector("a-scene");
  sceneEl.addEventListener("arReady", onArReady);

  // Перевод текста A-Frame на русский
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
