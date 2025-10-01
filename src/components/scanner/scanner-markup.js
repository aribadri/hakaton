export const createScannerMarkup = () => {
  return `
    <div id="custom-scanner" class="hidden">
      <div class="scanner-container">
        <!-- Рамка -->
        <div class="film-frame"></div>

        <!-- Перфорация слева -->
        <div class="perforation perforation-left">
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
        </div>

        <!-- Перфорация справа -->
        <div class="perforation perforation-right">
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
          <div class="perforation-hole"></div>
        </div>

        <!-- Сканирующая линия -->
        <div class="scan-line"></div>

        <!-- Контент -->
        <div class="scanner-content">
          <svg class="scanner-icon vintage-camera" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Корпус камеры -->
            <rect x="20" y="45" width="80" height="50" rx="8" fill="#F8F2E9" stroke="#FF6F23" stroke-width="3"/>

            <!-- Объектив -->
            <circle cx="60" cy="70" r="20" fill="#FF6F23" stroke="#F8F2E9" stroke-width="3"/>
            <circle cx="60" cy="70" r="12" fill="#F8F2E9" opacity="0.3"/>

            <!-- Вспышка -->
            <rect x="85" y="50" width="10" height="8" rx="2" fill="#FFD700"/>

            <!-- Видоискатель -->
            <rect x="40" y="30" width="40" height="12" rx="4" fill="#F8F2E9" stroke="#FF6F23" stroke-width="2"/>

            <!-- Кнопка -->
            <circle cx="90" cy="70" r="5" fill="#FFD700" stroke="#FF6F23" stroke-width="2"/>

            <!-- Лучи от камеры (эффект сканирования) -->
            <g class="camera-rays">
              <line x1="60" y1="30" x2="60" y2="15" stroke="#FFD700" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
              <line x1="75" y1="35" x2="85" y2="25" stroke="#FFD700" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
              <line x1="45" y1="35" x2="35" y2="25" stroke="#FFD700" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
            </g>
          </svg>

          <div class="scanner-text">Наведите камеру</div>
          <div class="scanner-subtext">на скульптуру СоюзМультПарка</div>
        </div>
      </div>
    </div>
  `;
};

export const injectScanner = () => {
  const markup = createScannerMarkup();
  document.body.insertAdjacentHTML('afterbegin', markup);
  return document.getElementById('custom-scanner');
};
