import { isSafariWithHEVCAlphaSupport } from './instructions';

document.addEventListener('DOMContentLoaded', () => {
  const isLargeScreen = window.innerWidth >= 1024;
  const loadingOverlay = document.getElementById('loading-overlay');
  if (!loadingOverlay) return; // fail-safe

  const fallbackImage = document.createElement('img');
  fallbackImage.id = 'loading-fallback';
  fallbackImage.src = isLargeScreen ? '/loading/loading-lg.png' : '/loading/loading.png';
  fallbackImage.alt = 'Loading…';
  fallbackImage.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full z-0';

  const loadingVideo = document.createElement('video');
  loadingVideo.id = 'loading-animation';
  loadingVideo.autoplay = true;
  loadingVideo.muted = true;
  loadingVideo.loop = true;
  loadingVideo.playsInline = true;
  loadingVideo.className = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[60%] h-auto z-10';
  loadingVideo.src = isSafariWithHEVCAlphaSupport() ? '/loading/loading-ios.mov' : '/loading/loading.webm';

  loadingOverlay.appendChild(fallbackImage);
  loadingOverlay.appendChild(loadingVideo);
});
