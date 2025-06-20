import { initAudioPlayer } from './audioPlayer.js';
import { createRecordList } from './recordList.js';
import { updateStaticDots } from './debug';
import { showWelcomeModal } from './modal.js';
import { showDragInstruction, updatePlayerWrapperOpacity } from './instructions.js';
import { getSnappedRecord } from './constants.js';

document.addEventListener(
  'touchmove',
  (e) => {
    if (e.cancelable) e.preventDefault();
  },
  { passive: false },
);

document.addEventListener('DOMContentLoaded', () => {
  const recordListContainer = document.getElementById('record-list');
  showWelcomeModal();

  if (localStorage.getItem('welcomeModalShown') && !getSnappedRecord()) {
    showDragInstruction();
  }

  initAudioPlayer();
  createRecordList(recordListContainer);
  requestAnimationFrame(() => {
    updateStaticDots();
    updatePlayerWrapperOpacity();
  });

  window.addEventListener('resize', () => {
    const recordListContainer = document.getElementById('record-list');
    recordListContainer.innerHTML = '';

    createRecordList(recordListContainer);
    requestAnimationFrame(updateStaticDots);
  });
});
