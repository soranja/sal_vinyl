import { initAudioPlayer } from './audioPlayer.js';
import { createRecordList } from './recordList.js';
import { updateStaticDots } from './debug';

let debugVisible = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'F4') {
    debugVisible = !debugVisible;
    document.querySelectorAll('.debug-toggleable').forEach((el) => {
      el.style.display = debugVisible ? 'block' : 'none';
    });
  }

  ['toggle-areas', 'toggle-snap-zones', 'toggle-dots', 'toggle-state-panel'].forEach((id) => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.checked = debugVisible;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  initAudioPlayer();

  const recordListContainer = document.getElementById('record-list');
  createRecordList(recordListContainer);

  requestAnimationFrame(() => {
    updateStaticDots();
    document.querySelectorAll('.debug-toggleable').forEach((el) => {
      el.style.display = 'none';
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('[class*="z-[2000]"], [id$="-pos"]').forEach((el) => el.remove());
    document.querySelector('.debug-container')?.remove();

    const recordListContainer = document.getElementById('record-list');
    recordListContainer.innerHTML = '';
    createRecordList(recordListContainer);

    requestAnimationFrame(updateStaticDots);
  });
});
