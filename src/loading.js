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

  function hideLoader() {
    loader.classList.add('opacity-0', 'pointer-events-none');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  // Detect Safari w/ alpha support
  const useHEVC = isSafariWithHEVCAlphaSupport();

  // Set video source dynamically
  const source = document.createElement('source');
  source.src = useHEVC ? '/loading/loading-ios.mov' : '/loading/loading.webm';
  source.type = useHEVC ? 'video/quicktime' : 'video/webm';

  // Replace existing <source> to be safe
  video.innerHTML = ''; // Clear default source
  video.appendChild(source);

  // Force load (Safari safety)
  video.preload = 'auto';
  video.load();

  // Hide loader on load
  window.addEventListener('load', hideLoader);

  // Also hide after video can play
  video.addEventListener('canplay', hideLoader);

  // Fallback after 3 seconds
  setTimeout(hideLoader, 3000);
});
