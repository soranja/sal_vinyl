import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export function initProgressBar(audio, record, recordSpin) {
  // Create the progress bar elements
  const barWrapper = document.createElement('div');
  barWrapper.className = `
    w-[60%] h-3 rounded-full bg-neutral-800 relative
    overflow-hidden shadow-inner
  `;

  const barFill = document.createElement('div');
  barFill.className = 'absolute left-0 top-0 h-full bg-green-500 w-0';
  barWrapper.appendChild(barFill);

  const pointer = document.createElement('div');
  pointer.className = `
    absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white 
    rounded-full shadow-md cursor-pointer z-10
  `;
  barWrapper.appendChild(pointer);

  // Append to DOM
  const app = document.getElementById('app');
  app.appendChild(barWrapper);

  // Progress update loop
  function updateProgress() {
    const ratio = audio.currentTime / audio.duration;
    const barWidth = barWrapper.offsetWidth;
    const newX = ratio * barWidth;

    gsap.set(barFill, { width: newX });
    gsap.set(pointer, { x: newX });

    if (!audio.paused) requestAnimationFrame(updateProgress);
  }

  // Wait for layout to be ready before enabling drag
  requestAnimationFrame(() => {
    const barWidth = barWrapper.offsetWidth;

    Draggable.create(pointer, {
      type: 'x',
      bounds: { minX: 0, maxX: barWidth },
      onDragStart: () => {
        audio.pause();
        if (recordSpin) recordSpin.pause();
      },
      onDrag: function () {
        const ratio = this.x / barWidth;
        const newTime = ratio * audio.duration;
        gsap.set(barFill, { width: this.x });
        audio.currentTime = newTime;

        // Sync record rotation with drag
        const newRotation = ratio * 360;
        gsap.set(record, { rotation: newRotation });
      },
      onDragEnd: () => {
        audio.play();
        if (recordSpin) recordSpin.play();
        updateProgress();
      },
    });
  });

  audio.addEventListener('play', updateProgress);
}
