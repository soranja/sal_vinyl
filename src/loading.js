function isSafariWithHEVCAlphaSupport() {
  const ua = navigator.userAgent;
  const isApple = /Macintosh|iPhone|iPad|iPod/.test(ua);
  const isRealSafari =
    ua.includes('Safari') &&
    !ua.includes('Chrome') &&
    !ua.includes('CriOS') &&
    !ua.includes('FxiOS') &&
    !ua.includes('EdgiOS') &&
    !ua.includes('OPiOS') &&
    !ua.includes('SamsungBrowser');
  const safariMatch = ua.match(/Version\/(\d+)\./);
  const safariVersion = safariMatch ? parseInt(safariMatch[1], 10) : 0;
  return isRealSafari && isApple && safariVersion >= 13;
}

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-overlay');
  const video = document.getElementById('loading-animation');
  if (!loader || !video) return;

  let loaderHidden = false;
  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    loader.classList.add('opacity-0', 'pointer-events-none');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  // Set correct video source
  const useHEVC = isSafariWithHEVCAlphaSupport();
  const source = document.createElement('source');
  source.src = useHEVC ? '/loading/loading-ios.mov' : '/loading/loading.webm';
  source.type = useHEVC ? 'video/quicktime' : 'video/webm';
  video.innerHTML = '';
  video.appendChild(source);
  video.preload = 'auto';
  video.load();

  // Attempt to play video explicitly
  video.play().catch(() => {
    // Mobile autoplay might fail — fallback is in place
  });

  // Hide on load, or when video is ready
  window.addEventListener('load', hideLoader);
  video.addEventListener('canplay', hideLoader);
  video.addEventListener('loadeddata', hideLoader); // extra fallback

  // Failsafe timeout
  setTimeout(hideLoader, 3000);
});
