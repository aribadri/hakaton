import { gsap } from "gsap";

const getScreenshot = {
  init: function () {
    const sceneEl = this.el;

    // белый экран для вспышки
    const flash = document.createElement("div");
    flash.className = "flash";
    document.body.appendChild(flash);

    // кнопки
    const btns = document.createElement("div");
    btns.className = "btns";
    btns.innerHTML = `
      <button id="captureBtn"></button>
      <button id="shareBtn" class="hidden">📤</button>
      <button id="saveBtn" class="hidden">💾</button>
      <button id="filesBtn" class="hidden">📂</button>
    `;
    document.body.appendChild(btns);

    // превью
    const resultImgWrapper = document.createElement("div");
    resultImgWrapper.className = "result-wrapper hidden";

    const resultImg = document.createElement("img");
    resultImg.id = "resultImg";

    const backBtn = document.createElement("button");
    backBtn.className = "back-btn hidden";
    backBtn.innerHTML = "✖";

    resultImgWrapper.appendChild(resultImg);
    resultImgWrapper.appendChild(backBtn);
    document.body.appendChild(resultImgWrapper);

    // ссылки
    const captureBtn = btns.querySelector("#captureBtn");
    const shareBtn = btns.querySelector("#shareBtn");
    const saveBtn = btns.querySelector("#saveBtn");
    const filesBtn = btns.querySelector("#filesBtn");

    let lastDataUrl = null;

    //
    // 📸 Сделать фото
    //
    captureBtn.addEventListener("click", () => {
      // эффект вспышки
      flash.style.opacity = "1";
      setTimeout(() => (flash.style.opacity = "0"), 120);

      const video = sceneEl.systems["mindar-image-system"]?.video;
      const renderer = sceneEl.renderer;
      const camera = sceneEl.camera;
      const threeScene = sceneEl.object3D;

      if (!video || !renderer || !camera) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      // итоговый канвас (под размеры экрана устройства, а не всего видео!)
      const cw = window.innerWidth;
      const ch = window.innerHeight;

      const out = document.createElement("canvas");
      out.width = cw;
      out.height = ch;
      const ctx = out.getContext("2d");

      //
      // 1) кроп видео так же, как MindAR делает на экране
      //
      const videoAspect = vw / vh;
      const canvasAspect = cw / ch;

      let sx, sy, sw, sh;
      if (videoAspect > canvasAspect) {
        // видео слишком широкое → обрезаем по ширине
        sh = vh;
        sw = vh * canvasAspect;
        sx = (vw - sw) / 2;
        sy = 0;
      } else {
        // видео слишком высокое → обрезаем по высоте
        sw = vw;
        sh = vw / canvasAspect;
        sx = 0;
        sy = (vh - sh) / 2;
      }

      // рисуем камеру (как на экране)
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);

      //
      // 2) отрендерим AR слой под тот же размер (экран)
      //
      const arCanvas = document.createElement("canvas");
      arCanvas.width = cw;
      arCanvas.height = ch;

      const arRenderer = new THREE.WebGLRenderer({
        canvas: arCanvas,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      arRenderer.setSize(cw, ch, false);
      arRenderer.setViewport(0, 0, cw, ch);
      arRenderer.outputEncoding = THREE.sRGBEncoding;
      arRenderer.toneMapping = THREE.NoToneMapping;

      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();

      arRenderer.render(threeScene, camera);

      // рисуем AR поверх
      ctx.drawImage(arCanvas, 0, 0, cw, ch);

      //
      // 3) итог
      //
      lastDataUrl = out.toDataURL("image/png"); // PNG чтобы не темнело
      resultImg.src = lastDataUrl;
      resultImgWrapper.classList.remove("hidden");
      resultImg.classList.add("show");
      gsap.delayedCall(0.3, () => backBtn.classList.remove("hidden"));

      // переключение кнопок
      captureBtn.classList.add("hidden");
      shareBtn.classList.remove("hidden");
      saveBtn.classList.remove("hidden");
      filesBtn.classList.add("hidden");
    });

    //
    // 🔗 Поделиться
    //
    shareBtn.addEventListener("click", async () => {
      if (!lastDataUrl) return;
      const blob = await (await fetch(lastDataUrl)).blob();
      const file = new File([blob], "screenshot.jpg", { type: "image/jpeg" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "СоюзМультПарк" });
      } else {
        alert("Поделиться не поддерживается на этом устройстве.");
      }
    });

    //
    // 💾 Сохранить
    //
    saveBtn.addEventListener("click", () => {
      if (!lastDataUrl) return;
      filesBtn.href = lastDataUrl;
      shareBtn.classList.add("hidden");
      saveBtn.classList.add("hidden");
      filesBtn.classList.remove("hidden");

      const link = document.createElement("a");
      link.href = lastDataUrl;
      link.download = "СоюзМульПарк.jpg";
      link.type = "image/jpeg";
      document.body.append(link);
      link.click();
      link.remove();
    });

    //
    // 📂 Файлы
    //
    filesBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = "shareddocuments://";
      document.body.append(link);
      link.click();
      link.remove();
    });

    //
    // ✖ Назад
    //
    backBtn.addEventListener("click", () => {
      resultImgWrapper.classList.add("hidden");
      resultImg.src = "";
      captureBtn.classList.remove("hidden");
      shareBtn.classList.add("hidden");
      saveBtn.classList.add("hidden");
      filesBtn.classList.add("hidden");
      backBtn.classList.add("hidden");
    });
  },
};

export { getScreenshot };
