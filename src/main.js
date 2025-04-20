import { initAudioPlayer } from './audioPlayer.js';
import { createRecordList } from './recordList.js';
import { updateStaticDots } from './trackers.js';

document.addEventListener('DOMContentLoaded', () => {
  initAudioPlayer();

  const recordListContainer = document.getElementById('record-list');
  createRecordList(recordListContainer);

  requestAnimationFrame(updateStaticDots);

  window.addEventListener('resize', () => {
    document.querySelectorAll('[class*="z-[2000]"], [id$="-pos"]').forEach((el) => el.remove());
    document.querySelector('.debug-container')?.remove();

    const recordListContainer = document.getElementById('record-list');
    recordListContainer.innerHTML = '';
    createRecordList(recordListContainer);

    requestAnimationFrame(updateStaticDots);
  });
});
