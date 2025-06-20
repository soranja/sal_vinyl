function setAppHeight() {
  const doc = document.documentElement;
  const height = window.innerHeight;
  doc.style.setProperty('--app-height', `${height}px`);
}

window.addEventListener('DOMContentLoaded', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);

let lastHeight = window.innerHeight;
window.addEventListener('resize', () => {
  const currentHeight = window.innerHeight;
  if (Math.abs(currentHeight - lastHeight) > 100) {
    setAppHeight();
    lastHeight = currentHeight;
  }
});
