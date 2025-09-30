import { getScreenshot } from "./components/getScreenshot.js";
import { changeTextures } from "./components/change-textures.js";
import { preloadTextures, startPanorama } from "./panorama";
import config from "./config.js";
import { initPreloader, completePreloader } from "./components/preloader/preloader.js";

AFRAME.registerComponent("screenshot-ui", getScreenshot);
AFRAME.registerComponent("change-textures", changeTextures);
AFRAME.registerComponent("smooth-position", {
  schema: { lerp: { default: 0.15 } },
  tick() {
    const o = this.el.object3D;
    if (!this._p) this._p = o.position.clone();
    this._p.lerp(o.position, this.data.lerp);
    o.position.copy(this._p);
  },
});

const onArReady = async (e) => {
  completePreloader();

  const closeBtn = document.querySelector("#panoramaCloseBtn");
  const canvas = document.querySelector(".panorama");
  const rightBTN = document.querySelector(".btn-right");
  const leftBTN = document.querySelector(".btn-left");

  await preloadTextures(config.panoList);

  startPanorama();

  const panBtn = document.querySelector("#panoramaBtn");
  panBtn.classList.remove("hidden");

  panBtn.addEventListener("click", () => {
    closeBtn.classList.remove("hidden");
    canvas.classList.remove("hidden");
    leftBTN.classList.remove("hidden");
    rightBTN.classList.remove("hidden");
  });
  e.target.setAttribute("screenshot-ui", "");
};

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();

  const sceneEl = document.querySelector("a-scene");
  sceneEl.addEventListener("arReady", onArReady);
});
