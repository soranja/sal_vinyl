import { records } from './constants.js';
import { initProximitySnap } from './snap.js';
import { initRecordDragging } from './drag.js';
import { createVinylWrapper } from './vinylWrapper.js';

export function createRecordList(container) {
  const recordListWidth = container.offsetWidth;
  const isSmallScreen = window.innerWidth <= 1024;
  const wrapperSize = Math.trunc(recordListWidth * (isSmallScreen ? 0.18 : 0.8));
  const overlap = Math.trunc(wrapperSize * 0.4);

  records.forEach((record, index) => {
    const zLayer = 10 + index;

    const { recordWrapper, _, vinyl } = createVinylWrapper(record, wrapperSize, index);

    recordWrapper.dataset.index = index + 1;
    recordWrapper.style.zIndex = zLayer;
    recordWrapper.dataset.initZ = `${zLayer}`;
    recordWrapper.style.width = `${wrapperSize}px`;
    recordWrapper.style.height = `${wrapperSize}px`;

    if (isSmallScreen) {
      recordWrapper.style.marginLeft = index === 0 ? `0px` : `-${overlap}px`;
    } else {
      recordWrapper.style.marginTop = index === 0 ? `0px` : `-${overlap}px`;
    }

    container.appendChild(recordWrapper);

    const audio = new Audio(record.audio);
    audio.loop = false;

    initProximitySnap(recordWrapper, audio);
    initRecordDragging(recordWrapper, vinyl);
  });
}
