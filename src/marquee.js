let marqueeTimeouts = [];

function clearMarqueeTimers() {
  marqueeTimeouts.forEach(clearTimeout);
  marqueeTimeouts = [];
}

export function startMarquee(title, wrapper) {
  clearMarqueeTimers();

  const distance = title.scrollWidth - wrapper.offsetWidth;
  if (distance <= 0) {
    // no overflow, nothing to do
    title.style.transition = 'none';
    title.style.transform = 'translateX(0)';
    return;
  }

  function slide(toLeft) {
    clearMarqueeTimers();
    title.style.transition = 'transform 2s linear';
    title.style.transform = toLeft ? `translateX(-${distance}px)` : 'translateX(0)';

    // after 2s slide + 1s pause, flip direction
    const t = setTimeout(() => slide(!toLeft), 2000 + 1000);
    marqueeTimeouts.push(t);
  }

  // initial 1s pause, then first slide-left
  marqueeTimeouts.push(setTimeout(() => slide(true), 1000));
}

export function stopMarquee(title) {
  clearMarqueeTimers();
  title.style.transition = 'none';
  title.style.transform = 'translateX(0)';
}
