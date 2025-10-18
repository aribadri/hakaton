export const initMask = () => {
  const markup = `
    <div id="mask-container" class="hidden">
      <button id="maskCloseBtn" class="mask-close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </button>
      <div class="mask-content">
        <!-- Здесь будет контент маски -->
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', markup);

  const closeBtn = document.getElementById('maskCloseBtn');
  closeBtn.addEventListener('click', hideMask);

  return document.getElementById('mask-container');
};

export const showMask = () => {
  const maskContainer = document.querySelector('#mask-container');
  const maskBtn = document.querySelector('#maskBtn');

  if (maskContainer) {
    maskContainer.classList.remove('hidden');
  }

  if (maskBtn) {
    maskBtn.classList.add('hidden');
  }
};

export const hideMask = () => {
  const maskContainer = document.querySelector('#mask-container');
  const maskBtn = document.querySelector('#maskBtn');

  if (maskContainer) {
    maskContainer.classList.add('hidden');
  }

  if (maskBtn) {
    maskBtn.classList.remove('hidden');
  }
};
