import { getScreenshot } from "./components/getScreenshot.js";
import { changeTextures } from "./components/change-textures.js";
import { preloadTextures, startPanorama } from "./panorama";
import config from "./config.js";

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

let arSystem;

const onArReady = async (e) => {
  if (arSystem) return;
  const closeBtn = document.querySelector("#panoramaCloseBtn");
  const canvas = document.querySelector(".panorama");
  const rightBTN = document.querySelector(".btn-right");
  const leftBTN = document.querySelector(".btn-left");
  const panBtn = document.querySelector("#panoramaBtn");
  arSystem = e.target.systems["mindar-image-system"];
  panBtn.classList.remove("hidden");
  e.target.setAttribute("screenshot-ui", "");

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
  const sceneEl = document.querySelector("a-scene");
  sceneEl.addEventListener("arReady", onArReady);
});
