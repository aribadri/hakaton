export const createScannerMarkup = () => {
  return `
    <div id="custom-scanner" class="hidden">
      <div class="scanner-container">
        <!-- Минималистичная рамка -->
        <div class="scanner-frame">
          <div class="corner corner-tl"></div>
          <div class="corner corner-tr"></div>
          <div class="corner corner-bl"></div>
          <div class="corner corner-br"></div>
          <!-- Тонкая сканирующая линия -->
          <div class="scan-line"></div>
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
