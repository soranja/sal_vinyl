import { records } from './constants.js';
import { initProximitySnap } from './snap.js';
import { initRecordDragging } from './drag.js';
import { createVinylWrapper } from './vinylWrapper.js';

export function createRecordList(container) {
  const recordList = document.getElementById('record-list');
  const recordListWidth = recordList.offsetWidth;
  const wrapperSize = recordListWidth * 0.8;

  records
    .slice()
    .reverse()
    .forEach((record, index) => {
      const { recordWrapper, _, vinyl } = createVinylWrapper(record, wrapperSize, index);

      container.appendChild(recordWrapper);

      const player = document.getElementById('player');
      const audio = new Audio(record.audio);
      audio.loop = false;
      audio.volume = 0.1;

      initProximitySnap(recordWrapper, player, audio);
      initRecordDragging(recordWrapper, vinyl);
    });
}
