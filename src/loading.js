document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-overlay');
  const video = document.getElementById('loading-animation');
  if (!loader) return;

  function hideLoader() {
    loader.classList.add('opacity-0', 'pointer-events-none');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }

  // 1) normal full‐page load
  window.addEventListener('load', hideLoader);

  // 3) Safari iOS extra safety: force metadata-only load
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari && video) {
    video.preload = 'metadata';
    video.load();
  }

  // 4) fallback after 3 seconds in case load/pageshow never fire
  setTimeout(hideLoader, 3000);
});
