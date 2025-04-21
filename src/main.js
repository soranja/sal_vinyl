import { initAudioPlayer } from './audioPlayer.js';
import { createRecordList } from './recordList.js';
import { updateStaticDots } from './debug';

document.addEventListener('DOMContentLoaded', () => {
  const recordListContainer = document.getElementById('record-list');

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
