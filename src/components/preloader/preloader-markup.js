export const createPreloaderMarkup = () => {
  return `
    <div id="ar-preloader" class="ar-preloader">
      <div class="preloader-content">
        <div class="preloader-logo">
          <img src="images/SMP_logo_invers_RGB.svg" alt="СоюзМультПарк" class="logo-svg" />
        </div>

        <div class="preloader-characters">
          <img src="images/character-kesha.png" alt="Кеша" class="character character-left" />
          <img src="images/character-karlson.png" alt="Карлсон" class="character character-right" />
        </div>

        <div class="preloader-text">
          <p class="loading-label">Загружаем AR-опыт...</p>
          <p class="loading-percent">0%</p>
        </div>

        <div class="preloader-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>
  `;
};

export const injectPreloader = () => {
  const markup = createPreloaderMarkup();
  document.body.insertAdjacentHTML('afterbegin', markup);
  return document.getElementById('ar-preloader');
};
