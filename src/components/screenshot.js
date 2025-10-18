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
      <button id="vkBtn" class="vk-share-btn hidden">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2Z" fill="#0077FF"/>
          <path d="M16.5 15.45C16.14 15.45 15.48 15.24 14.43 14.19C13.46 13.22 13.05 13.08 12.78 13.08C12.41 13.08 12.31 13.18 12.31 13.68V15.08C12.31 15.45 12.19 15.7 11.29 15.7C9.84 15.7 8.23 14.83 7.05 13.29C5.32 11.06 4.7 9.14 4.7 8.74C4.7 8.47 4.8 8.22 5.3 8.22H6.7C7.13 8.22 7.29 8.42 7.46 8.87C8.27 11.05 9.57 12.92 10.09 12.92C10.3 12.92 10.4 12.82 10.4 12.26V10.01C10.34 8.92 9.83 8.82 9.83 8.42C9.83 8.22 10 8.02 10.27 8.02H12.73C13.08 8.02 13.21 8.19 13.21 8.83V11.71C13.21 12.06 13.36 12.19 13.48 12.19C13.69 12.19 13.88 12.06 14.27 11.67C15.37 10.43 16.16 8.53 16.16 8.53C16.28 8.28 16.48 8.02 16.91 8.02H18.31C18.82 8.02 18.94 8.29 18.82 8.83C18.62 9.84 16.89 12.25 16.89 12.25C16.73 12.51 16.67 12.63 16.89 12.93C17.04 13.15 17.58 13.59 17.93 14C18.68 14.84 19.29 15.56 19.45 16.06C19.61 16.56 19.35 16.81 18.8 16.81H17.4C16.97 16.81 16.78 16.56 16.5 15.45Z" fill="white"/>
        </svg>
        <span>Поделиться в VK</span>
      </button>
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

    // CTA плашка с конкурсом
    const ctaBanner = document.createElement("div");
    ctaBanner.className = "cta-banner";
    ctaBanner.innerHTML = `
      <div class="cta-content">
        <div class="cta-icon">🎁</div>
        <div class="cta-text">
          <div class="cta-title">Выиграй приз!</div>
          <div class="cta-subtitle">Поделись фото ВКонтакте с хештегом #СоюзМультПарк</div>
          <div class="cta-info">Подробности на кассе</div>
        </div>
      </div>
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
    const vkBtn = btns.querySelector("#vkBtn");
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
      vkBtn.classList.remove("hidden");
      shareBtn.classList.remove("hidden");
      saveBtn.classList.remove("hidden");
      filesBtn.classList.add("hidden");
    });

    //
    // 💙 Поделиться в VK
    //
    vkBtn.addEventListener("click", async () => {
      if (!lastDataUrl) return;

      // Текст для поста с хештегом
      const shareText = encodeURIComponent("Я создал AR-фото в СоюзМультПарке! 🎬✨ #СоюзМультПарк #ВДНХ #AR");

      // Попытка использовать Web Share API (если доступно)
      const blob = await (await fetch(lastDataUrl)).blob();
      const file = new File([blob], "СоюзМультПарк-AR.jpg", { type: "image/jpeg" });

      if (navigator.canShare && navigator.canShare({ files: [file], text: shareText })) {
        try {
          await navigator.share({
            files: [file],
            text: "Я создал AR-фото в СоюзМультПарке! 🎬✨ #СоюзМультПарк #ВДНХ #AR",
            title: "СоюзМультПарк AR"
          });
        } catch (err) {
          // Если пользователь отменил или ошибка - открываем VK напрямую
          if (err.name !== 'AbortError') {
            window.open(`https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${shareText}`, '_blank');
          }
        }
      } else {
        // Fallback: открываем VK share dialog
        window.open(`https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${shareText}`, '_blank');
      }
    });

    //
    // 🔗 Поделиться (другие соцсети)
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
      vkBtn.classList.add("hidden");
      shareBtn.classList.add("hidden");
      saveBtn.classList.add("hidden");
      filesBtn.classList.add("hidden");
      backBtn.classList.add("hidden");
    });
  },
};

export { getScreenshot };
