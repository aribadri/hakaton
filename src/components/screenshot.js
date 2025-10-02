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
      <button id="shareBtn" class="hidden">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button id="saveBtn" class="hidden">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V16M12 16L8 12M12 16L16 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button id="filesBtn" class="hidden">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H13L11 4H5C3.89543 4 3 4.89543 3 6V7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
    document.body.appendChild(btns);

    // превью
    const resultImgWrapper = document.createElement("div");
    resultImgWrapper.className = "result-wrapper hidden";

    const resultImg = document.createElement("img");
    resultImg.id = "resultImg";

    // CTA плашка
    const ctaBanner = document.createElement("div");
    ctaBanner.className = "cta-banner";
    ctaBanner.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Предъяви фото на кассе и получи скидку 10%</span>
    `;

    const backBtn = document.createElement("button");
    backBtn.className = "back-btn hidden";
    backBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;

    resultImgWrapper.appendChild(resultImg);
    resultImgWrapper.appendChild(ctaBanner);
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
