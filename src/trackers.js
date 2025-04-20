import gsap from 'gsap';
import { getSnappedRecord, getCurrentDraggedRecord, readyPos, records } from './constants';

// Track Center Marker
export function createCenterMarker(label = '', color = 'bg-yellow-500') {
  const marker = document.createElement('div');
  marker.className = `
    absolute 
    z-50 w-[15px] h-[15px] 
    ${color} rounded-full border-1 border-white 
    flex items-center justify-center 
    text-[10px] text-white font-bold
    pointer-events-none opacity-60
    translate-x-[-50%] translate-y-[-50%]
  `;
  marker.textContent = label;
  document.body.appendChild(marker);
  return marker;
}

// -----------------------------------------------------------------------------
//                             Position helpers
// -----------------------------------------------------------------------------
export function getCenterOfElement(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function getCenterDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function trackAndUpdateCenter(el, marker) {
  function updateMarkerPosition() {
    const { x, y } = getCenterOfElement(el);
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    requestAnimationFrame(updateMarkerPosition);
  }
  updateMarkerPosition();
}

export function getElementPosition(el) {
  const rect = el.getBoundingClientRect();
  return {
    topLeft: {
      x: rect.left,
      y: rect.top,
    },
    center: {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    },
  };
}

// -----------------------------------------------------------------------------
//                         Debug overlay (coords + flags)
// -----------------------------------------------------------------------------
/**
 * Builds a floating debug UI showing each tracked element's top‑left coords
 * and, for records, a list of their TRUE state flags on the same line.
 */
export function initElementPositionUI(elements = []) {
  const debugContainer = document.createElement('div');
  debugContainer.className = 'absolute bottom-2 right-2 space-y-1 z-50 text-xs flex flex-col debug-container';

  debugContainer.innerHTML = elements
    .map(({ id }) => `<div id="${id}-pos" class="bg-black/70 text-white px-2 py-1 rounded">${id}: --</div>`)
    .join('');

  document.body.appendChild(debugContainer);

  // Full list of boolean flags we want to watch in the UI
  const flagList = [
    'isInInitArea',
    'isInInitSnapZone',
    'isReadyForInitSnap',
    'initSnapped',
    'initDragged',
    'isInReadyArea',
    'isInReadySnapZone',
    'isReadyForReadySnap',
    'readyDragged',
    'readySnapped',
    'frozen',
  ];

  function updateUI() {
    elements.forEach(({ id, el, recordData }) => {
      const posEl = document.getElementById(`${id}-pos`);
      if (!posEl) return;

      const rect = el.getBoundingClientRect();
      const baseText = `${id}: ${Math.round(rect.left)}, ${Math.round(rect.top)}`;

      if (recordData) {
        const activeFlags = flagList.filter((f) => recordData[f]).join(' ');
        posEl.textContent = activeFlags ? `${baseText} | ${activeFlags}` : baseText;
      } else {
        posEl.textContent = baseText;
      }
    });

    requestAnimationFrame(updateUI);
  }

  updateUI();
}

// -----------------------------------------------------------------------------
//                       Init & ready position visual helpers
// -----------------------------------------------------------------------------
export function drawInitCenterDot({ x, y }, label = '', color = 'bg-white') {
  const marker = document.createElement('div');
  marker.className = `
    fixed w-[10px] h-[10px] ${color} rounded-full z-[2000] 
    pointer-events-none 
    border border-white text-[9px] text-center text-white
    flex items-center justify-center 
    translate-x-[-50%] translate-y-[-50%]
  `.trim();
  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  marker.textContent = label;
  document.body.appendChild(marker);
  return marker;
}

export function updateStaticDots() {
  // ready centre (player)
  const player = document.getElementById('player');
  const readyCenter = getCenterOfElement(player);
  readyPos.x = readyCenter.x;
  readyPos.y = readyCenter.y;
  drawInitCenterDot(readyCenter, 'R', 'bg-red-500');

  // every record wrapper in the list
  const allRecords = document.querySelectorAll('#record-list > div');

  gsap.delayedCall(0, () => {
    allRecords.forEach((rec) => {
      const center = getCenterOfElement(rec);
      const idx = +rec.dataset.index - 1;

      // persist init position in constants
      records[idx].initPos = center;
      rec.dataset.initCenter = JSON.stringify(center);

      drawInitCenterDot(center, rec.dataset.index, 'bg-blue-500');
    });

    // kick‑off debug overlay (coords + flags)
    initElementPositionUI([
      { id: 'R', el: player },
      ...Array.from(allRecords).map((el, i) => ({ id: `${i + 1}`, el, recordData: records[i] })),
    ]);
  });
}

// -----------------------------------------------------------------------------
//                              Console logger
// -----------------------------------------------------------------------------
export function logStates() {
  const dragged = getCurrentDraggedRecord();
  const snapped = getSnappedRecord();
  const allRecords = document.querySelectorAll('#record-list > div');
  const needle = document.getElementById('needle');

  const initSnapped = [];
  const playerSnapped = [];

  allRecords.forEach((record) => {
    const center = record.getBoundingClientRect();
    const playerCenter = document.getElementById('player').getBoundingClientRect();
    const distToPlayer = Math.hypot(center.x - playerCenter.x, center.y - playerCenter.y);

    if (distToPlayer < 150) {
      playerSnapped.push(record);
    } else {
      initSnapped.push(record);
    }
  });

  console.log({
    currentDraggedRecord: dragged
      ? {
          name: dragged.dataset.name,
          index: dragged.dataset.index,
          position: {
            x: gsap.getProperty(dragged, 'x'),
            y: gsap.getProperty(dragged, 'y'),
          },
        }
      : null,

    initSnappedRecords: initSnapped.map((r) => ({ name: r.dataset.name, index: r.dataset.index })),

    playerSnappedRecords: playerSnapped.map((r) => ({ name: r.dataset.name, index: r.dataset.index })),

    allInitialZIndexes: Array.from(allRecords).map((r) => ({
      name: r.dataset.name,
      index: r.dataset.index,
      zIndex: r.style.zIndex,
    })),

    snappedRecordZIndex: snapped
      ? { name: snapped.dataset.name, index: snapped.dataset.index, zIndex: snapped.style.zIndex }
      : null,

    needleZIndex: needle ? window.getComputedStyle(needle).zIndex : null,
  });
}
