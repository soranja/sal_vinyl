// Audio Player
import { initAudioPlayer } from './audioPlayer.js';

// Record List
import { createRecordList } from './recordList.js';

document.addEventListener('DOMContentLoaded', () => {
  initAudioPlayer();

  const recordListContainer = document.getElementById('record-list');
  createRecordList(recordListContainer);

  window.addEventListener('resize', () => {
    recordListContainer.innerHTML = '';
    createRecordList(recordListContainer);
  });
});
