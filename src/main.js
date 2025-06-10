import { initAudioPlayer } from './audioPlayer.js';
import { createRecordList } from './recordList.js';
import { updateStaticDots } from './debug';
import { showWelcomeModal } from './modal.js';

document.addEventListener(
  'touchmove',
  (e) => {
    if (e.cancelable) e.preventDefault();
  },
  { passive: false },
);

document.addEventListener('DOMContentLoaded', () => {
  const recordListContainer = document.getElementById('record-list');
  const title = document.getElementById('record-title');
  const description = document.getElementById('record-description');
  const audioBackground = document.getElementById('ready-area-background');

  showWelcomeModal();

  // if (title) {
  //   title.textContent = '';
  //   title.classList.add('hidden');
  // }
  // if (description) {
  //   description.textContent = '';
  //   description.classList.add('hidden');
  // }
  // if (audioBackground) audioBackground.style.backgroundImage = '';

  initAudioPlayer();
  createRecordList(recordListContainer);
  requestAnimationFrame(() => updateStaticDots());

  window.addEventListener('resize', () => {
    const recordListContainer = document.getElementById('record-list');
    recordListContainer.innerHTML = '';

    createRecordList(recordListContainer);
    requestAnimationFrame(updateStaticDots);
  });
});
