import { isSafariWithHEVCAlphaSupport } from './instructions';

document.addEventListener('DOMContentLoaded', () => {
  const isLargeScreen = window.innerWidth >= 1024;
  const loadingOverlay = document.getElementById('loading-overlay');
  if (!loadingOverlay) return;

  // Fallback image
  const loadingImage = document.createElement('img');
  loadingImage.id = 'loading-fallback';
  loadingImage.src = isLargeScreen ? '/loading/loading-lg.png' : '/loading/loading.png';
  loadingImage.alt = 'Loading…';
  loadingImage.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full z-0';

  // Loading video
  const loadingVideo = document.createElement('video');
  loadingVideo.id = 'loading-animation';
  loadingVideo.autoplay = true;
  loadingVideo.muted = true;
  loadingVideo.loop = true;
  loadingVideo.playsInline = true;
  loadingVideo.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[60%] h-auto z-10';
  loadingVideo.src = isSafariWithHEVCAlphaSupport() ? '/loading/loading-ios.mov' : '/loading/loading.webm';

  loadingOverlay.appendChild(loadingImage);
  loadingOverlay.appendChild(loadingVideo);
});

// Fade out and remove when page fully loaded
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (!loadingOverlay) return;

  // Trigger fade-out
  loadingOverlay.style.opacity = '0';

  // Remove after transition
  loadingOverlay.addEventListener('transitionend', () => loadingOverlay.remove(), { once: true });
});
