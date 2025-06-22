import { isSafariWithHEVCAlphaSupport } from './instructions';

const MIN_LOAD_TIME = 700;
const startTime = performance.now();

document.addEventListener('DOMContentLoaded', () => {
  const isLargeScreen = window.innerWidth >= 1024;
  const loadingOverlay = document.getElementById('loading-overlay');
  if (!loadingOverlay) return;

  loadingOverlay.innerHTML = `
    <img
      id="loading-fallback"
      src="${isLargeScreen ? '/loading/loading-lg.png' : '/loading/loading.png'}"
      alt="Loading…"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full z-0"
    >
    <video
      id="loading-animation"
      autoplay
      muted
      loop
      playsinline
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[60%] h-auto z-10"
      src="${isSafariWithHEVCAlphaSupport() ? '/loading/loading-ios.mov' : '/loading/loading.webm'}"
    ></video>
  `;
});

window.addEventListener('load', () => {
  const elapsed = performance.now() - startTime;
  const delay = Math.max(0, MIN_LOAD_TIME - elapsed);

  const loadingOverlay = document.getElementById('loading-overlay');
  if (!loadingOverlay) return;

  setTimeout(() => {
    loadingOverlay.style.opacity = '0';
    loadingOverlay.addEventListener(
      'transitionend',
      () => {
        loadingOverlay.remove();
      },
      { once: true },
    );
  }, delay);
});
