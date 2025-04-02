import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { getCenterOfElement, getCenterDistance } from './trackers.js';
import { logRecordState } from './trackers.js';

let snapped = false;

export function isRecordSnapped() {
  return snapped;
}

export function initProximitySnap(recordEl, playerEl) {
  const indicator = document.createElement('div');
  indicator.className = `
    absolute 
    bottom-2 left-1/2 -translate-x-1/2 
    z-50 px-3 py-1 rounded-lg text-white font-bold 
    text-sm pointer-events-none transition-all duration-300
  `;
  document.body.appendChild(indicator);

  function updateProximity() {
    const recordWrapper = document.getElementById('record-wrapper');
    const needle = document.getElementById('needle');
    const recordCenter = getCenterOfElement(recordEl);
    const playerCenter = getCenterOfElement(playerEl);
    const distance = getCenterDistance(recordCenter, playerCenter);

    const nearThreshold = window.innerWidth * 0.07;
    const matchThreshold = 5;

    if (distance < matchThreshold) {
      //   indicator.textContent = 'MATCH';
      //   indicator.style.backgroundColor = '#22c55e';
      recordWrapper.style.zIndex = 20;
      needle.style.zIndex = 30;
      snapped = true;
    } else if (distance < nearThreshold) {
      //   indicator.textContent = 'CLOSE';
      //   indicator.style.backgroundColor = '#eab308';

      if (!snapped) {
        logRecordState('Before Snap');
        const offsetX = playerCenter.x - recordCenter.x;
        const offsetY = playerCenter.y - recordCenter.y;
        const currentX = gsap.getProperty(recordEl, 'x');
        const currentY = gsap.getProperty(recordEl, 'y');

        gsap.to(recordEl, {
          x: currentX + offsetX,
          y: currentY + offsetY,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
          onUpdate: () => {
            const draggable = Draggable.get(recordEl);
            if (draggable) draggable.update();
          },
          onComplete: () => {
            recordWrapper.style.zIndex = 20;
            needle.style.zIndex = 30;
            logRecordState('After Snap');
          },
        });

        snapped = true;
      }
    } else {
      //   indicator.textContent = 'FAR';
      //   indicator.style.backgroundColor = '#ef4444';
      recordWrapper.style.zIndex = 30;
      needle.style.zIndex = 20;
      snapped = false;
    }

    requestAnimationFrame(updateProximity);
  }

  updateProximity();
}
