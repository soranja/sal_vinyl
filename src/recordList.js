import { records } from './constants.js';
import { initProximitySnap } from './snap.js';
import { initRecordDragging } from './drag.js';
import { createVinylWrapper } from './vinylWrapper.js';

export function createRecordList(container) {
  const recordListWidth = container.offsetWidth;
  const wrapperSize = recordListWidth * 0.8;

  records.forEach((record, index) => {
    const zLayer = 10 + index;

    const { recordWrapper, _, vinyl } = createVinylWrapper(record, wrapperSize, index);

    recordWrapper.dataset.index = index + 1;
    recordWrapper.style.zIndex = zLayer;
    recordWrapper.dataset.initZ = `${zLayer}`;

    container.appendChild(recordWrapper);

    const audio = new Audio(record.audio);
    audio.loop = false;

    initProximitySnap(recordWrapper, audio);
    initRecordDragging(recordWrapper, vinyl);
  });
}
