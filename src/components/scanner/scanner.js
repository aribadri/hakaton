import { injectScanner } from './scanner-markup.js';
import { initScannerAnimations } from './scanner-animations.js';

export const initScanner = () => {
  const scannerElement = injectScanner();
  initScannerAnimations();
  return scannerElement;
};
