document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-overlay');
  if (!loader) return;

  // fires once ALL images, background-images, and <link> CSS are fetched
  window.addEventListener('load', () => {
    // trigger the Tailwind transition (opacity 1 → 0)
    loader.classList.add('opacity-0');
    // once it’s visually gone, remove it entirely
    loader.addEventListener(
      'transitionend',
      () => {
        loader.remove();
      },
      { once: true },
    );
  });
});
