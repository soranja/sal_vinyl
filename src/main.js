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

window.addEventListener('load', () => {
  initAudioPlayer();
  requestAnimationFrame(() => {
    const container = document.getElementById('record-list');
    if (container) {
      if (container.offsetWidth < 50) {
        console.warn('Small container width.');
        setTimeout(() => createRecordList(container), 100);
      } else {
        createRecordList(container);
      }
    }

    updateStaticDots();
    updatePlayerWrapperOpacity();
    showWelcomeModal();

    if (localStorage.getItem('welcomeModalShown') && !getSnappedRecord()) {
      showDragInstruction();
    }
  });
});
