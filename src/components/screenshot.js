import { gsap } from "gsap";
import { getMode } from "../state.js";
import { getFaceRenderer, getFaceCamera, getFaceVideo, getFaceScene } from "../faceScene.js";

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
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.75 5.49977H8.5V10.031C8.5 10.1636 8.44732 10.2908 8.35355 10.3846C8.25979 10.4783 8.13261 10.531 8 10.531C7.86739 10.531 7.74021 10.4783 7.64645 10.3846C7.55268 10.2908 7.5 10.1636 7.5 10.031V5.49977H4.25C3.78602 5.50026 3.34119 5.6848 3.01311 6.01288C2.68503 6.34096 2.5005 6.78579 2.5 7.24977V13.2498C2.5005 13.7137 2.68503 14.1586 3.01311 14.4867C3.34119 14.8147 3.78602 14.9993 4.25 14.9998H11.75C12.214 14.9993 12.6588 14.8147 12.9869 14.4867C13.315 14.1586 13.4995 13.7137 13.5 13.2498V7.24977C13.4995 6.78579 13.315 6.34096 12.9869 6.01288C12.6588 5.6848 12.214 5.50026 11.75 5.49977ZM8.5 2.70696L10.1466 4.35321C10.2411 4.44302 10.367 4.49234 10.4973 4.49068C10.6277 4.48901 10.7523 4.43647 10.8445 4.34427C10.9367 4.25207 10.9892 4.1275 10.9909 3.99712C10.9926 3.86674 10.9432 3.74086 10.8534 3.64633L8.35344 1.14633C8.25968 1.05263 8.13255 1 8 1C7.86745 1 7.74032 1.05263 7.64656 1.14633L5.14656 3.64633C5.05675 3.74086 5.00742 3.86674 5.00909 3.99712C5.01076 4.1275 5.0633 4.25207 5.1555 4.34427C5.2477 4.43647 5.37227 4.48901 5.50265 4.49068C5.63303 4.49234 5.75891 4.44302 5.85344 4.35321L7.5 2.70696V5.49977H8.5V2.70696Z" fill="white"/>
        </svg>
        <span>Поделиться</span>
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
    const maskBtn = document.querySelector("#maskBtn");

    let lastDataUrl = null;

    //
    // 📸 Сделать фото
    //
    captureBtn.addEventListener("click", () => {
      // эффект вспышки
      flash.style.opacity = "1";
      setTimeout(() => (flash.style.opacity = "0"), 120);

      const mode = getMode();
      let video, renderer, camera, threeScene;

      if (mode === "face") {
        video = getFaceVideo();
        renderer = getFaceRenderer();
        camera = getFaceCamera();
        threeScene = getFaceScene();
      } else {
        video = sceneEl.systems["mindar-image-system"]?.video;
        renderer = sceneEl.renderer;
        camera = sceneEl.camera;
        threeScene = sceneEl.object3D;
      }

      if (!video || !renderer || !camera) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = window.innerWidth * dpr;
      const ch = window.innerHeight * dpr;

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
        antialias: true,
      });
      arRenderer.setSize(cw, ch, false);
      arRenderer.setViewport(0, 0, cw, ch);
      arRenderer.outputEncoding = THREE.sRGBEncoding;
      arRenderer.toneMapping = THREE.NoToneMapping;

      const screenshotCamera = new THREE.PerspectiveCamera(
        camera.fov,
        cw / ch,
        camera.near,
        camera.far
      );
      screenshotCamera.position.copy(camera.position);
      screenshotCamera.quaternion.copy(camera.quaternion);
      screenshotCamera.scale.copy(camera.scale);
      screenshotCamera.updateMatrixWorld();

      arRenderer.render(threeScene, screenshotCamera);

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

      // Hide mask button when photo is taken
      if (maskBtn) maskBtn.classList.add("hidden");
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

      // Show mask button when returning to AR mode
      if (maskBtn) maskBtn.classList.remove("hidden");
    });
  },
};

export { getScreenshot };
