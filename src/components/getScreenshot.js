import { gsap } from "gsap";
const getScreenshot = {
  init: function () {
    const sceneEl = this.el;

    // создаём белый экран для эффекта "вспышки"
    const flash = document.createElement("div");
    flash.className = "flash";
    document.body.appendChild(flash);

    // создаём обёртку для кнопок
    const btns = document.createElement("div");
    btns.className = "btns";
    btns.innerHTML = `
        <button id="captureBtn"></button>
        <button id="shareBtn" class="hidden">📤</button>
        <button id="saveBtn" class="hidden">💾</button>
        <button id="filesBtn" class="hidden">📂</button>
      `;
    document.body.appendChild(btns);

    // создаём обёртку для превью
    const resultImgWrapper = document.createElement("div");
    resultImgWrapper.className = "result-wrapper hidden";

    const resultImg = document.createElement("img");
    resultImg.id = "resultImg";

    // кнопка "назад" (крестик)
    const backBtn = document.createElement("button");
    backBtn.className = "back-btn";
    backBtn.innerHTML = "✖";
    backBtn.classList.add("hidden");

    resultImgWrapper.appendChild(resultImg);
    resultImgWrapper.appendChild(backBtn);
    document.body.appendChild(resultImgWrapper);

    const captureBtn = btns.querySelector("#captureBtn");
    const shareBtn = btns.querySelector("#shareBtn");
    const saveBtn = btns.querySelector("#saveBtn");
    const saveLink = btns.querySelector("#saveLink");

    let lastDataUrl = null;

    // обработчик "сделать фото"
    captureBtn.addEventListener("click", () => {
      flash.style.opacity = "1";
      setTimeout(() => {
        flash.style.opacity = "0";
      }, 100);
      const sceneCanvas = sceneEl.renderer.domElement;
      const video = sceneEl.systems["mindar-image-system"].video;

      if (!sceneCanvas || !video) return;

      const width = sceneCanvas.width;
      const height = sceneCanvas.height;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext("2d");

      // размеры видео
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const videoAspect = vw / vh;
      const canvasAspect = width / height;

      let sx, sy, sw, sh;
      if (videoAspect > canvasAspect) {
        sh = vh;
        sw = vh * canvasAspect;
        sx = (vw - sw) / 2;
        sy = 0;
      } else {
        sw = vw;
        sh = vw / canvasAspect;
        sx = 0;
        sy = (vh - sh) / 2;
      }

      // камера
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, width, height);
      // WebGL
      ctx.drawImage(sceneCanvas, 0, 0, width, height);

      lastDataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);

      resultImg.src = lastDataUrl;
      resultImgWrapper.classList.remove("hidden");
      resultImg.classList.add("show");
      gsap.delayedCall(0.3, () => backBtn.classList.remove("hidden"));

      // скрываем кнопку фото, показываем share/save
      captureBtn.classList.add("hidden");
      shareBtn.classList.remove("hidden");
      saveBtn.classList.remove("hidden");
      filesBtn.classList.add("hidden");
    });

    // поделиться
    shareBtn.addEventListener("click", async () => {
      if (!lastDataUrl) return;
      const blob = await (await fetch(lastDataUrl)).blob();
      const file = new File([blob], "screenshot.jpg", { type: "image/jpeg" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "СоюзМультПарк",
          text: "",
        });
      } else {
        alert("Поделиться не поддерживается на этом устройстве.");
      }
    });

    // сохранить
    saveBtn.addEventListener("click", () => {
      if (!lastDataUrl) return;

      filesBtn.href = lastDataUrl;

      // прячем share/save, показываем только files
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

    filesBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = "shareddocuments://";
      document.body.append(link);
      link.click();
      link.remove();
    });

    // кнопка назад
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
