import { gsap } from "gsap";

const getScreenshot = {
  init: function () {
    const sceneEl = this.el;

    // белый экран для эффекта "вспышки"
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

    // превью результата
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

    // ссылки на кнопки
    const captureBtn = btns.querySelector("#captureBtn");
    const shareBtn = btns.querySelector("#shareBtn");
    const saveBtn = btns.querySelector("#saveBtn");
    const filesBtn = btns.querySelector("#filesBtn");

    let lastDataUrl = null;

    //
    // 📸 Сделать фото
    //
  //
// 📸 Сделать фото
//
captureBtn.addEventListener("click", () => {
  // эффект вспышки
  flash.style.opacity = "1";
  setTimeout(() => (flash.style.opacity = "0"), 120);

  const video = sceneEl.systems["mindar-image-system"]?.video;
  const ss = sceneEl.components?.screenshot;
  if (!video || !ss) return;

  // AR-слой (канвас с 3D)
  const arCanvas = ss.getCanvas("perspective");
  if (!arCanvas) return;

  // размеры видео
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return;

  // создаём общий канвас под размеры видео
  const out = document.createElement("canvas");
  out.width = vw;
  out.height = vh;
  const ctx = out.getContext("2d");

  // 1) слой камеры (видеофид)
  ctx.drawImage(video, 0, 0, vw, vh);

  // 2) слой AR (масштабируем AR-канвас в размер видео)
  ctx.drawImage(arCanvas, 0, 0, arCanvas.width, arCanvas.height, 0, 0, vw, vh);

  // итоговое изображение
  lastDataUrl = out.toDataURL("image/jpeg", 0.95);
  resultImg.src = lastDataUrl;
  resultImgWrapper.classList.remove("hidden");
  resultImg.classList.add("show");
  gsap.delayedCall(0.3, () => backBtn.classList.remove("hidden"));

  // переключаем кнопки
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
        await navigator.share({
          files: [file],
          title: "СоюзМультПарк",
        });
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

      // скачивание
      const link = document.createElement("a");
      link.href = lastDataUrl;
      link.download = "СоюзМультПарк.jpg";
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
